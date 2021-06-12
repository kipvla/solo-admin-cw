import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import axios from 'axios';
import CheckIcon from '../../assets/img/check-icon.ico';
import CrossIcon from '../../assets/img/delete-icon.png';
import './TestResults.css';

const {REACT_APP_SERVER_URL} = process.env;

function Media(props) {
  const { data } = props;
  return (
    <TableCell>
      {data !== '' ? (
        <a href={data} target="_blank" rel="noopener noreferrer">
          <span>{data}</span>
        </a>
      ) : (
        'N/A'
      )}
    </TableCell>
  );
}

Media.propTypes = {
  data: PropTypes.any,
};

export default function ShowTestResults(props) {
  const { id } = props.match.params;
  const [data, setData] = useState({});

  const getTestResultsById = async () => {
    try {
      const jwt = localStorage.getItem('session');
      const authConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.get(
        `${REACT_APP_SERVER_URL}/stats/admin/getTestResults/${id}`,
        authConfig,
      );
      setData(res.data);
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.removeItem('session');
        window.location.href = '/';
      }
      console.log(err);
    }
  };

  useEffect(() => {
    getTestResultsById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const getColor = (response, choiceIdx) => {
    const choice = response.choices[choiceIdx];
    const userAnswer = response.userAnswer;
    const userCorrect = response.userRespondedCorrectly;
    if (userAnswer !== choiceIdx && !choice.correct) {
      return 'transparent';
    }
    if (choice.correct || userCorrect) {
      return 'rgba(131, 247, 61, 0.4)';
    }
    if (userAnswer === choiceIdx && !choice.correct) {
      return 'rgba(206,68,68,0.6)';
    }
  };

  const getJSXQuestions = (responses) => {
    const questionFormat = (
      <div>
        {responses.map((response,index)=> {
          return (
            <div className="question-container" key={index}>
              <div className="icon-container">
                <img
                  alt=""
                  src={response.userRespondedCorrectly ? CheckIcon : CrossIcon}
                  className="icons-questions"
                />
                <div className="question-tag">
                  <span className="question-number">Questions #{index + 1}. </span>
                  {response.question}
                </div>
              </div>
              {
                response.choices.map((choice, choiceIdx) => {
                  return (
                    <div
                      key={choiceIdx}
                      className="choices"
                      style={{backgroundColor: getColor(response, choiceIdx)}}>
                      <div>{choice.name}</div>
                    </div>
                  );
                })
              }
            </div>);
        })}
      </div>);
    return questionFormat;

  };
  return (
    <Container>
      <h4>Test results detail </h4>
      <TableContainer component={Paper}>
        {Boolean(data && Object.entries(data).length > 0) && (
          <Table>
            <TableBody>
              {data.keysLabel.map((key, index) => {
                if (key.field === 'options') {
                  return null;
                }

                if (!key.type) key.type = typeof data.allInfo[key.field];

                return (
                  <TableRow key={index}>
                    <TableCell>{key.headerName}</TableCell>
                    {key.type === 'boolean' ? (
                      <TableCell>
                        {data.allInfo[key.field] ? 'Sí' : 'No'}
                      </TableCell>
                    ) : key.type === 'fotos' || key.type === 'videos' ? (
                      <Media data={data.allInfo[key.field]} field={key.type} />
                    ) : key.type === 'array' ? (
                      <TableCell>
                        {
                          getJSXQuestions(data.allInfo[key.field])                      
                        }
                      </TableCell>
                    ) : (
                      <TableCell>{data.allInfo[key.field] || 'N/A'}</TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <br />
    </Container>
  );
}

ShowTestResults.propTypes = {
  match: PropTypes.any,
};
