import React, {  useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  TableCell,
  FormControl,
  TextField,
} from '@material-ui/core';
import moment from 'moment';
import CustomToast from '../../components/myComponents/custom-toast';
import { toast } from 'react-toastify';
import axios from 'axios';

const {REACT_APP_SERVER_URL} = process.env;

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

export default function ShowStatsGroup(props) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (startDate < endDate) {
      const jwt = localStorage.getItem('session');
      try {
        const serverRes = await axios(`${REACT_APP_SERVER_URL}/stats/admin/global?startDateQuery=${startDate}&endDateQuery=${endDate}`, {method: 'GET', responseType: 'blob', headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },});
        const file = new Blob([serverRes.data], {type: 'application/pdf'});
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL);
      } catch (e) {
        if (e.response.status === 401) {
          localStorage.removeItem('session');
          window.location.href = '/';
        }
      }

    } else {
      toast(
        <CustomToast title="Start date cannot be greater than end date!" />,
      );
    }
  };
  return (
    <Container>
      <h4>Global Report</h4>
      <form onSubmit={onSubmit}>
        <FormControl key={'startDate'} className="custom-field-form">
          <TextField
            id="datetime-local"
            label="Start Date"
            type="datetime-local"
            required={true}
            onChange={(e) => {
              setStartDate(
                moment(e.target.value, 'YYYY-MM-DDTHH:mm').toISOString(),
              );
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl key={'endDate'} className="custom-field-form">
          <TextField
            id="datetime-local"
            label="End Date"
            type="datetime-local"
            required={true}
            onChange={(e) => {
              setEndDate(
                moment(e.target.value, 'YYYY-MM-DDTHH:mm').toISOString(),
              );
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <Button type="submit" variant="contained">
          Search
        </Button>
      </form>
      <br />
    </Container>
  );
}

ShowStatsGroup.propTypes = {
  match: PropTypes.any,
};
