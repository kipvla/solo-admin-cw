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
import { URL } from '../../assets/constants/url';
import axios from 'axios';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function Media(props) {
  const { data } = props;
  // hay que ver si es una foto un video o un array de fotos o videos
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

  const getActivityTypeData = async () => {
    try {
      // this request returns all option of the different grades along with the id;
      const res = await axios.get(
        `${URL}/api/test/activityTypeByID/${id}`,
        config,
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getActivityTypeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container>
      <h4>Detalle Actividad </h4>
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
                          return <div key={index}>{ele}</div>;
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
