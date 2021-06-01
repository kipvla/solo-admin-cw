import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../../assets/constants/url';
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

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function ListTopics() {
  const entityID = JSON.parse(localStorage.getItem('entity'))._id;
  const userID = JSON.parse(localStorage.getItem('user'))._id;
  const [data, setData] = useState({});
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hardRows, setHardRows] = useState([]);

  const getInformationDB = async () => {
    try {
      // this request returns all option of the different grades along with the id;
      const res = await axios.get(
        `${URL}/api/test/activity-type/${entityID}`,
        config,
      );
      setIsLoading(false);
      setData(res.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const deleteData = async (id) => {
    console.log(id);
    try {
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      const dataToSend = {
        userID,
      };
      const body = JSON.stringify(dataToSend);
      const res = await axios.post(
        `${URL}/api/calendar/disable-activity-type/${id}`,
        body,
        config,
      );
      toast(<CustomToast title={res.data} />);
      setIsDeleteModal(false);
      setIdToDelete(0);
      window.location.reload();
      // hideProgressDialog();
    } catch (e) {
      // hideProgressDialog();
      console.log(e);
    }
  };

  const Options = (params) => {
    const mongoID = params.row._id;

    return (
      <div>
        {Boolean(data.tableOptions.show) && (
          <Link to={`/admin/show/activity-types/${mongoID}`}>
            <IconButton style={{ padding: '7px' }}>
              <Visibility color="action" />
            </IconButton>
          </Link>
        )}
        {Boolean(data.tableOptions.edit) && (
          <Link to={`/admin/edit/activity-types/${mongoID}`}>
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
            <h4>Actividades</h4>
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
          ¿Estás seguro de que deseas eliminar este elemento?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDeleteModal(false);
              setIdToDelete(0);
            }}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => deleteData(idToDelete)}
            color="primary"
            autoFocus
          >
            Borrar
          </Button>
        </DialogActions>
      </Dialog>
    </GridContainer>
  );
}
