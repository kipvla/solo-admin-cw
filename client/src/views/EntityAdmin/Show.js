import React from 'react';
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
import CheckIcon from '../../assets/img/check-icon.ico';
import CrossIcon from '../../assets/img/delete-icon.png';
function Media(props) {
  const {data} = props;
  // hay que ver si es una foto un video o un array de fotos o videos
  return (
    <TableCell>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {Array.isArray(data) && data.length > 0 ? (
          data.map(photo => {
            return (
              <a
                key={photo}
                href={photo}
                target="_blank"
                rel="noopener noreferrer">
                <span>{photo}</span>
              </a>
            );
          })
        ) : data !== '' ? (
          <a key={data} href={data} target="_blank" rel="noopener noreferrer">
            <span>{data}</span>
          </a>
        ) : (
          'N/A'
        )}
      </div>
    </TableCell>
  );
}

Media.propTypes = {
  data: PropTypes.any,
};

export default function Show(props) {
  const {data} = props;

  return (
    <Container>
      <h4>{data.categoryName} detail</h4>
      <TableContainer component={Paper}>
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
                  ) : key.type === 'fotos' ||
                    key.type === 'videos' ||
                    key.type === 'image' ? (
                      <Media data={data.allInfo[key.field]} field={key.type} />
                    ) : key.type === 'array' ? (
                      <TableCell>
                        {data.allInfo[key.field].map((ele, index) => {
                          return <div key={index}>{ele}</div>;
                        })}
                      </TableCell>
                    ) : key.type === 'arrayObject' ? (
                      <TableCell>
                        {data.allInfo[key.field].map((ele, index) => {
                          return (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginBottom: '10px',
                              }}>
                              <div
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}>
                                <img
                                  alt=""
                                  src={ele.answer ? CheckIcon : CrossIcon}
                                  style={{width: '25px', height: '25px'}}
                                />
                                <div style={{marginLeft: '10px'}}>
                                  {' '}
                                  #{index + 1} {ele.question}
                                </div>
                              </div>
                              <div>
                                ¿Cuál? :{' '}
                                {ele.comment === '' ? 'N/A' : ele.comment}{' '}
                              </div>
                            </div>
                          );
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
      </TableContainer>
      <br />
    </Container>
  );
}

Show.propTypes = {
  data: PropTypes.any,
};
