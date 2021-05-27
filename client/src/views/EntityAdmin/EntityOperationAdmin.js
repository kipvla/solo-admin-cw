import React, { Fragment, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import GridContainer from 'components/defaultComponents/Grid/GridContainer'
import GridItem from 'components/defaultComponents/Grid/GridItem'
import {
  Button,
  Card,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { URL } from '../../assets/constants/url'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import ImageUploader from 'react-images-upload'
import CustomToast from '../../components/myComponents/custom-toast/index'
import { toast } from 'react-toastify'

import './Entity.css'

function Reference(props) {
  const { field, updateData } = props
  const [options, setOptions] = useState([])

  useEffect(() => {
    setOptions(field.options)
  }, [])

  return (
    <Autocomplete
      size="small"
      options={options}
      getOptionLabel={(option) => option.title}
      onChange={(e, v) =>
        updateData(field.field, { title: v?.title, value: v?.value } || null)
      }
      style={{ width: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={field.headerName}
          variant="outlined"
          required={field.required}
        />
      )}
    />
  )
}

export default function EntityOperationAdmin(props) {
  const { operation, queryPost, queryGet, categoryName, entity } = props
  const entityID = JSON.parse(localStorage.getItem('entity'))._id
  const userID = JSON.parse(localStorage.getItem('user'))._id
  const [entityFields, setEntityFields] = useState([])
  const [data, setData] = useState({})
  const [disabled, setDisabled] = useState(true)
  const inputEl = useRef(null)

  const getInfoFromDB = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const res = await axios.get(`${URL}/api/${queryGet}`, config)
      setEntityFields(res.data.keysLabel)
      setDisabled(false)
    } catch (err) {
      setDisabled(true)
      console.log(err)
    }
  }

  useEffect(() => {
    getInfoFromDB()
  }, [])

  const onNewEntity = async () => {
    try {
      setDisabled(true)
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      }
      data.entityID = entityID
      data.createdBy = userID
      data.updatedBy = userID
      const body = JSON.stringify(data)
      const res = await axios.post(
        `${URL}/api/${queryPost}/${operation}`,
        body,
        config,
      )

      if (queryPost === 'test/calendar-day') {
        props.history.push({
          pathname: '/admin/activity-type/add',
          state: {
            gradeName: data.gradeName,
            dayNumber: { title: data.dayNumber, value: res.data },
          },
        })
      } else {
        toast(<CustomToast title={res.data} />)
        props.history.replace(`/admin/${entity}`)
      }
      setDisabled(false)
      setData({})

      // hideProgressDialog();
    } catch (e) {
      setDisabled(false)
      toast(<CustomToast title={e.response.data} />)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (operation === 'add') {
      onNewEntity()
    }
  }

  const updateData = (key, value) => {
    const _data = { ...data }
    if (value) {
      _data[key] = value
    } else {
      delete _data[key]
    }
    setData(_data)
  }
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const imageHandler = async (arrayOfImages, field) => {
    if (arrayOfImages.length > 0) {
      for (let i = 0; i < arrayOfImages.length; i++) {
        const currentImageFile = arrayOfImages[i]
        const base64 = await convertBase64(currentImageFile)
        updateData(field.field, {
          data: base64,
          mime: currentImageFile.type,
        })
      }

      return
    }

    updateData(field.field, null)
  }

  useEffect(() => {
    console.log(data, 'data changing')
  }, [data])

  const getField = (field) => {
    switch (field.type) {
      case 'string':
        return (
          <TextField
            label={field.headerName}
            variant="outlined"
            size="small"
            type="text"
            value={data[field.field] || ''}
            onChange={(e) => updateData(field.field, e.target.value)}
            required={field.required}
          />
        )
      case 'float':
      case 'integer':
        return (
          <TextField
            label={field.headerName}
            variant="outlined"
            size="small"
            type="number"
            value={data[field.field] || ''}
            onChange={(e) => updateData(field.field, e.target.value)}
            required={field.required}
            InputProps={{ inputProps: { min: 0 } }}
          />
        )
      case 'date':
        return (
          <TextField
            label={field.headerName}
            variant="outlined"
            size="small"
            type="date"
            value={data[field.field] || ''}
            onChange={(e) => updateData(field.field, e.target.value)}
            required={field.required}
          />
        )
      case 'reference':
        return <Reference field={field} updateData={updateData} />
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Checkbox
                color="default"
                checked={data[field.field] || false}
                onChange={(e) => updateData(field.field, e.target.checked)}
              />
            }
            label={field.headerName}
          />
        )
      case 'currency':
        return (
          <CurrencyTextField
            label={field.headerName}
            variant="standard"
            currencySymbol="$"
            outputFormat="number"
            onChange={(event, value) => updateData(field.field, value)}
            minimumValue={'0'}
            style={{ width: '20%' }}
            textAlign="left"
            required={field.required}
          />
        )
      case 'image':
        return (
          <ImageUploader
            ref={inputEl}
            withIcon={true}
            buttonText="Escoger imagen"
            onChange={(image) => imageHandler(image, field)}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
            label="Imagen de producto. Peso máximo: 5mb"
            withPreview={true}
            singleImage={true}
            required={field.required}
          />
        )
      default:
        return null
    }
  }

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <Container>
            {operation === 'add' && (
              <Fragment>
                <h4>Nuevo {categoryName} </h4>
                <form onSubmit={onSubmit}>
                  {Boolean(entityFields.length) &&
                    entityFields.map((field) => {
                      return (
                        <FormControl
                          key={field.field}
                          className="custom-field-form"
                        >
                          {getField(field)}
                        </FormControl>
                      )
                    })}
                  <Button type="submit" variant="contained" disabled={disabled}>
                    Guardar
                  </Button>
                </form>
              </Fragment>
            )}
            <br />
          </Container>
        </Card>
      </GridItem>
    </GridContainer>
  )
}

EntityOperationAdmin.propTypes = {
  match: PropTypes.any,
  history: PropTypes.any,
  operation: PropTypes.string.isRequired,
  queryPost: PropTypes.string.isRequired,
  queryGet: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
}

Reference.propTypes = {
  field: PropTypes.any,
  updateData: PropTypes.func,
}
