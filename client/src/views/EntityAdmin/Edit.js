import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {URL} from '../../assets/constants/url';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import ImageUploader from 'react-images-upload';
import CustomToast from '../../components/myComponents/custom-toast/index';
import {toast} from 'react-toastify';

function Reference(props) {
  const {field, updateData, data} = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (field.field === 'productCategorySpanish') {
      const currentOption = field.options.filter(
        ele => ele.value === data.productCategory,
      )[0];
      updateData(field.field, currentOption);
    }

    setOptions(field.options);
  }, [data.productCategory, field.field, field.options, updateData]);

  return (
    <Autocomplete
      size="small"
      value={data[field.field]}
      options={options}
      getOptionLabel={option => option.title}
      onChange={(e, v) =>
        updateData(field.field, {title: v?.title, value: v?.value} || null)
      }
      style={{width: '100%'}}
      renderInput={params => (
        <TextField
          {...params}
          label={field.headerName}
          variant="outlined"
          required={field.required}
        />
      )}
    />
  );
}

export default function Edit(props) {

  const {dataEdit, queryEdit, history} = props;
  const [data, setData] = useState({});
  const [entityFields, setEntityFields] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setData(dataEdit.allInfo);
    setEntityFields(dataEdit.keysLabel);
  }, [dataEdit.allInfo, dataEdit.keysLabel]);

  const updateData = (key, value) => {
    const _data = {...data};
    if (value) {
      _data[key] = value;
    } else {
      delete _data[key];
    }
    setData(_data);
  };

  const convertBase64 = file => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = error => {
        reject(error);
      };
    });
  };

  const imageHandler = async (arrayOfImages, field) => {
    if (arrayOfImages.length > 0) {
      for (let i = 0; i < arrayOfImages.length; i++) {
        const currentImageFile = arrayOfImages[i];
        const base64 = await convertBase64(currentImageFile);
        updateData(field.field, {
          data: base64,
          mime: currentImageFile.type,
        });
      }

      return;
    }

    updateData(field.field, null);
  };

  const getField = field => {
    const types = {
      string: function () {
        return (
          <TextField
            label={field.headerName}
            variant="outlined"
            size="small"
            type="text"
            value={data[field.field] || ''}
            onChange={e => updateData(field.field, e.target.value)}
            required={field.required}
          />
        );
      },
      integer: function () {
        return (
          <TextField
            label={field.headerName}
            variant="outlined"
            size="small"
            type="number"
            value={data[field.field] || ''}
            onChange={e => updateData(field.field, e.target.value)}
            required={field.required}
            InputProps={{inputProps: {min: 0}}}
          />
        );
      },
      date: function () {
        return (
          <TextField
            label={field.headerName}
            variant="outlined"
            size="small"
            type="date"
            value={data[field.field] || ''}
            onChange={e => updateData(field.field, e.target.value)}
            required={field.required}
          />
        );
      },
      reference: function () {
        return <Reference field={field} updateData={updateData} data={data} />;
      },
      boolean: function () {
        return (
          <FormControlLabel
            control={
              <Checkbox
                color="default"
                checked={data[field.field] || false}
                onChange={e => updateData(field.field, e.target.checked)}
              />
            }
            label={field.headerName}
          />
        );
      },
      currency: function () {
        return (
          <CurrencyTextField
            label={field.headerName}
            variant="standard"
            currencySymbol="$"
            outputFormat="number"
            value={data[field.field]}
            onChange={(event, value) => updateData(field.field, value)}
            minimumValue={'0'}
            style={{width: '20%'}}
            textAlign="left"
            required={field.required}
          />
        );
      },
      image: function () {
        return (
          <ImageUploader
            withIcon={true}
            buttonText="Escoger imagen"
            onChange={image => imageHandler(image, field)}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
            label="Imagen de producto. Peso máximo: 5mb"
            withPreview={true}
            singleImage={true}
            required={field.required}
          />
        );
      },
    };
    if (typeof types[field.type] !== 'function')
      return null;
    return types[field.type]();
  };

  const updateField = async () => {
    try {
      setDisabled(true);
      const jwt = localStorage.getItem('session');
      const authConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
  
      const body = JSON.stringify(data);
      const res = await axios.put(`${URL}/${queryEdit}`, body, authConfig);
      toast(<CustomToast title={res.data} />);
      history.goBack();

      // hideProgressDialog();
    } catch (e) {
      setDisabled(false);
      if (e.response.status === 401) {
        localStorage.removeItem('session');
        window.location.href = '/';
      }
      // hideProgressDialog();
      console.log(e);
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    updateField();
  };

  return (
    <Container>
      <h4>Edit {dataEdit.categoryName} </h4>
      <form onSubmit={onSubmit}>
        {Boolean(entityFields.length) &&
          entityFields.map(field => {
            return (
              <FormControl key={field.field} className="custom-field-form">
                {getField(field)}
              </FormControl>
            );
          })}
        <Button type="submit" variant="contained" disabled={disabled}>
          Save
        </Button>
      </form>
      <br />
    </Container>
  );
}

Edit.propTypes = {
  dataEdit: PropTypes.any,
  queryEdit: PropTypes.string,
  history: PropTypes.any,
};

Reference.propTypes = {
  field: PropTypes.any,
  updateData: PropTypes.func,
  data: PropTypes.any,
};
