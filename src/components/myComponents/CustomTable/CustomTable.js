import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import GridContainer from 'components/defaultComponents/Grid/GridContainer';
import GridItem from 'components/defaultComponents/Grid/GridItem';
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Paper,
  TableContainer,
  IconButton,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {Edit, Visibility, Delete, AddCircle} from '@material-ui/icons';
import {DataGrid, GridToolbar} from '@material-ui/data-grid';

import {URL} from '../../../assets/constants/url';
import CustomToast from '../custom-toast';
import {toast} from 'react-toastify';


export default function CustomTable({
  tableName,
  query,
  queryByID,
  deleteQuery,
}) {
  
  const [data, setData] = useState({});
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hardRows, setHardRows] = useState([]);

  const getInfoFromDB = async () => {
    try {
      const jwt = localStorage.getItem('session');
      const authConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.get(`${URL}/${query}`, authConfig);
      setIsLoading(false);
      setData(res.data);
    } catch (err) {
      setIsLoading(false);
      if (err.response.status === 401) {
        localStorage.removeItem('session');
        window.location.href = '/';
      }
      console.log(err);
    }
  };

  useEffect(() => {
    if (data && Object.entries(data).length > 0) {
      setHardRows(
        data.allInfo.map((info, index) => {
          // To format data that can't be displayed in table
          info.id = index + 1;
          info.price = '$' + info.price?.$numberDecimal;
          info.done = info.done === true ? 'Sí' : 'No';

          return info;
        }),
      );
    }
  }, [data]);

  useEffect(() => {
    getInfoFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteData = async id => {
    try {
      const jwt = localStorage.getItem('session');
      const authConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.delete(
        `${URL}/${deleteQuery}/${id}`,
        authConfig,
      );
      toast(<CustomToast title={res.data} />);
      setIsDeleteModal(false);
      setIdToDelete(0);
      window.location.reload();
      // hideProgressDialog();
    } catch (e) {
      // hideProgressDialog();
      if (e.response.status === 401) {
        localStorage.removeItem('session');
        window.location.href = '/';
      }
      console.log(e);
    }
  };

  const Options = params => {
    const mongoID = params.row._id;
    const isCustom = params.field === 'optionsCustom' ? true : false;
    return (
      <div>
        {Boolean(data.tableOptions.show) && (
          <Link
            to={
              !isCustom
                ? `/admin/show/${mongoID}/${queryByID}`
                : `/admin/show/activity-children/${mongoID}`
            }
            target="_blank"
            rel="noopener noreferrer">
            <IconButton style={{padding: '7px'}}>
              <Visibility color="action" />
            </IconButton>
          </Link>
        )}
        {Boolean(data.tableOptions.edit) && (
          <Link
            to={`/admin/edit/${mongoID}/${queryByID}`}
            target="_blank"
            rel="noopener noreferrer">
            <IconButton style={{padding: '7px'}}>
              <Edit color="action" />
            </IconButton>
          </Link>
        )}
        {Boolean(data.tableOptions.delete) && (
          <IconButton
            style={{padding: '7px'}}
            onClick={() => {
              setIsDeleteModal(true);
              setIdToDelete(mongoID);
            }}>
            <Delete color="action" />
          </IconButton>
        )}
      </div>
    );
  };

  const OptionsTutor = params => {
    const mongoID = params.row._id;

    return (
      <div>
        <Link
          to={`/admin/children/add-tutor/${mongoID}`}
          target="_blank"
          rel="noopener noreferrer">
          <IconButton style={{padding: '7px'}}>
            <AddCircle color="action" />
          </IconButton>
        </Link>
        <Link
          to={`/admin/children/edit-tutor/${mongoID}`}
          target="_blank"
          rel="noopener noreferrer">
          <IconButton style={{padding: '7px'}}>
            <Edit color="action" />
          </IconButton>
        </Link>
      </div>
    );
  };

  const OptionsStats = params => {
    const mongoID = params.row._id;
    const childName = params.row.name + ' ' + params.row.lastName;

    return (
      <div>
        <Link
          to={`/admin/stats/child/${mongoID}/${childName}`}
          target="_blank"
          rel="noopener noreferrer">
          <IconButton style={{padding: '7px'}}>
            <Visibility color="action" />
          </IconButton>
        </Link>
      </div>
    );
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <Container>
            <h4>{tableName}</h4>
            <TableContainer component={Paper}>
              <div style={{height: 450, width: '100%'}}>
                <DataGrid
                  columns={
                    data &&
                    Object.entries(data).length > 0 &&
                    data.keysLabel.map(key => {
                      if (
                        key.field === 'options' ||
                        key.field === 'optionsCustom'
                      ) {
                        return {
                          field: key.field,
                          headerName: key.headerName,
                          width: 120,
                          disableClickEventBubbling: true,
                          renderCell: Options,
                        };
                      }

                      if (key.field === 'optionsTutor') {
                        return {
                          field: key.field,
                          headerName: key.headerName,
                          width: 200,
                          disableClickEventBubbling: true,
                          renderCell: OptionsTutor,
                        };
                      }

                      if (key.field === 'optionsStats') {
                        return {
                          field: key.field,
                          headerName: key.headerName,
                          width: 200,
                          disableClickEventBubbling: true,
                          renderCell: OptionsStats,
                        };
                      }

                      return {
                        field: key.field,
                        headerName: key.headerName,
                        width: 160,
                      };
                    })
                  }
                  rows={hardRows && hardRows.length > 0 ? hardRows : []}
                  isLoading={isLoading}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                />
              </div>
            </TableContainer>
            <br />
          </Container>
        </Card>
      </GridItem>
      <Dialog
        open={isDeleteModal}
        onClose={() => {
          setIsDeleteModal(false);
          setIdToDelete(0);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          ¿Are you sure you want to delete this element?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDeleteModal(false);
              setIdToDelete(0);
            }}
            color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => deleteData(idToDelete)}
            color="primary"
            autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </GridContainer>
  );
}

CustomTable.propTypes = {
  tableName: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  queryByID: PropTypes.string.isRequired,
  deleteQuery: PropTypes.string,
};
