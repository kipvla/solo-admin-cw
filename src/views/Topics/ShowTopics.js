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
import './Topics.css';

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

export default function ShowTopics(props) {
  const { id } = props.match.params;
  const [data, setData] = useState({});

  const getTopicById = async () => {
    try {
      const jwt = localStorage.getItem('session');
      const authConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.get(
        `${REACT_APP_SERVER_URL}/topic/admin/getTopicById/${id}`,
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
    getTopicById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const questionsJSXGenerator = (question, index) => {
    const questionName = question.question;
    const choices = question.choices;
    const choicesHTML = (
      <div>
        {choices.map((choice,index)=> {
          return (
            <div className="choice-container" key={index}>
              <img
                alt=""
                src={choice.correct ? CheckIcon : CrossIcon}
                className="icons-questions"
              />
              <div style={{marginRight: '5px'}}>{index+1}).</div>
              <div>{choice.name}</div>
            </div>);
        })}
      </div>);
    return (<div key={index} style={{marginBottom: '20px'}}><div style={{marginBottom: '10px'}}>Question #{index+1} {questionName}</div>{choicesHTML}</div>);

  };
  return (
    <Container>
      <h4>Topic Detail </h4>
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
                        {data.allInfo[key.field].map((ele, index) => {
                          return questionsJSXGenerator(ele, index);
                        })}
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

ShowTopics.propTypes = {
  match: PropTypes.any,
};
