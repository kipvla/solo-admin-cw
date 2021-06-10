import React, { useEffect, useState } from 'react';
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
import { Link } from 'react-router-dom';
import { Edit, Visibility, Delete } from '@material-ui/icons';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import CustomToast from '../../components/myComponents/custom-toast';
import { toast } from 'react-toastify';

const {REACT_APP_SERVER_URL} = process.env;

export default function ListTopics() {
  const [data, setData] = useState({});
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hardRows, setHardRows] = useState([]);

  const getInformationDB = async () => {
    try {
      const jwt = localStorage.getItem('session');
      const authConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.get(
        `${REACT_APP_SERVER_URL}/topic/admin/getAllTopics`,
        authConfig,
      );
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

  const deleteData = async (id) => {
    try {
      const jwt = localStorage.getItem('session');
      const authConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.delete(
        `${REACT_APP_SERVER_URL}/topic/admin/delete/${id}`,
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

  const Options = (params) => {
    const mongoID = params.row._id;

    return (
      <div>
        {Boolean(data.tableOptions.show) && (
          <Link to={`/admin/show/topics/${mongoID}`}>
            <IconButton style={{ padding: '7px' }}>
              <Visibility color="action" />
            </IconButton>
          </Link>
        )}
        {Boolean(data.tableOptions.edit) && (
          <Link to={`/admin/edit/topics/${mongoID}`}>
            <IconButton style={{ padding: '7px' }}>
              <Edit color="action" />
            </IconButton>
          </Link>
        )}
        {Boolean(data.tableOptions.delete) && (
          <IconButton
            style={{ padding: '7px' }}
            onClick={() => {
              setIsDeleteModal(true);
              setIdToDelete(mongoID);
            }}
          >
            <Delete color="action" />
          </IconButton>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (data && Object.entries(data).length > 0) {
      setHardRows(
        data.allInfo.map((info, index) => {
          info.id = index + 1;
          return info;
        }),
      );
    }
  }, [data]);

  useEffect(() => {
    getInformationDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <Container>
            <h4>Topics</h4>
            <TableContainer component={Paper}>
              <div style={{ height: 450, width: '100%' }}>
                <DataGrid
                  columns={
                    data &&
                    Object.entries(data).length > 0 &&
                    data.keysLabel.map((key) => {
                      if (key.field === 'options') {
                        return {
                          field: key.field,
                          headerName: key.headerName,
                          width: 160,
                          disableClickEventBubbling: true,
                          renderCell: Options,
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
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this item?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDeleteModal(false);
              setIdToDelete(0);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteData(idToDelete)}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </GridContainer>
  );
}
