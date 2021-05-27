import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import GridContainer from 'components/defaultComponents/Grid/GridContainer'
import GridItem from 'components/defaultComponents/Grid/GridItem'
import { Card } from '@material-ui/core'
import Show from './Show'
import Edit from './Edit'
import { URL } from '../../assets/constants/url'

export default function IdOperationEntityAdmin(props) {
  const { operation, id, query } = props.match.params

  const [data, setData] = useState(null)

  const getInformation = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const res = await axios.get(
        `${URL}/api/${query.replaceAll('-', '/')}/${id}`,
        config,
      )
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getInformation()
  }, [])

  const getOperation = () => {
    switch (operation) {
      case 'show':
        return <Show data={data} />
      case 'edit':
        return (
          <Edit
            {...props}
            dataEdit={data}
            queryEdit={`test/${data.entityName}/edit/${id}`}
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
          {data && Object.keys(data).length > 0 ? getOperation() : null}
        </Card>
      </GridItem>
    </GridContainer>
  )
}

IdOperationEntityAdmin.propTypes = {
  match: PropTypes.any,
}
