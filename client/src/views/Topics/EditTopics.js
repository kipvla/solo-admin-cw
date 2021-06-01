import React, { useEffect, useState, Fragment } from 'react';
import { URL } from '../../assets/constants/url';
import PropTypes from 'prop-types';
import axios from 'axios';
import GridContainer from 'components/defaultComponents/Grid/GridContainer';
import GridItem from 'components/defaultComponents/Grid/GridItem';
import {
  Button,
  Card,
  Container,
  FormControl,
  TextField,
} from '@material-ui/core';
import moment from 'moment';
import CustomToast from '../../components/myComponents/custom-toast';
import { toast } from 'react-toastify';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};
export default function EditTopics(props) {
  const { id } = props.match.params;
  const entityID = JSON.parse(localStorage.getItem('entity'))._id;
  const userID = JSON.parse(localStorage.getItem('user'))._id;
  const [data, setData] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [childQuestions, setChildQuestions] = useState(['']);
  const [guideQuestions, setGuideQuestions] = useState(['']);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [description, setDescription] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calendarFormatStartDate, setCalendarFormatStartDate] = useState('');
  const [calendarFormatEndDate, setCalendarFormatEndDate] = useState('');
  const [name, setName] = useState('');
  const [gradeName, setGradeName] = useState('');
  const [dayNumber, setDayNumber] = useState(0);
  const [activityDuration, setActivityDuration] = useState(0);

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
  const onSubmit = async (e) => {
    e.preventDefault();
    if (startDate < endDate) {
      const activityTypeInfo = {
        entityID,
        gradeID: selectedGrade,
        calendarDayID: selectedCalendarDay,
        videoURL: videoURL.trim().toLowerCase(),
        name: name.trim(),
        description: description.trim(),
        childQuestions,
        guideQuestions,
        updatedBy: userID,
        gradeName: gradeName.trim(),
        activityTypeID: data.allInfo._id,
        startDate,
        endDate,
        calendarFormatStartDate,
        calendarFormatEndDate,
        activityDuration,
      };
      const body = JSON.stringify(activityTypeInfo);
      try {
        setDisabled(true);
        const res = await axios.post(
          `${URL}/api/calendar/edit-activity-type`,
          body,
          config,
        );
        toast(<CustomToast title={res.data} />);
        props.history.goBack();
      } catch (e) {
        setDisabled(false);
        console.log(e);
      }
    } else {
      toast(
        <CustomToast title="La fecha inicial no puede ser mayor a la final." />,
      );
    }
  };

  const childQuestionRemover = (idx) => {
    setChildQuestions((prevChildQuestions) =>
      prevChildQuestions.filter((question, index) => index !== idx),
    );
  };

  const guideQuestionRemover = (idx) => {
    setGuideQuestions((prevGuideQuestions) =>
      prevGuideQuestions.filter((question, index) => index !== idx),
    );
  };

  const childQuestionsModifier = (idx, e) => {
    setChildQuestions((prevQuestions) => {
      let newQuestions = [...prevQuestions];
      newQuestions[idx] = e;
      return newQuestions;
    });
  };

  const guideQuestionsModifier = (idx, e) => {
    setGuideQuestions((prevQuestions) => {
      let newQuestions = [...prevQuestions];
      newQuestions[idx] = e;
      return newQuestions;
    });
  };

  const setStatesWithDBInfo = () => {
    const {
      gradeID,
      gradeName,
      dayNumber,
      name,
      description,
      videoURL,
      childQuestions,
      guideQuestions,
      calendarDayID,
      startDate,
      endDate,
      calendarFormatStartDate,
      calendarFormatEndDate,
      activityDuration,
    } = data.allInfo;
    setGradeName(gradeName);
    setSelectedGrade(gradeID);
    setDayNumber(dayNumber);
    setName(name);
    setDescription(description);
    setVideoURL(videoURL);
    setChildQuestions(childQuestions);
    setGuideQuestions(guideQuestions);
    setSelectedCalendarDay(calendarDayID);
    setStartDate(startDate);
    setEndDate(endDate);
    setCalendarFormatStartDate(calendarFormatStartDate);
    setCalendarFormatEndDate(calendarFormatEndDate);
    setActivityDuration(activityDuration);
  };

  useEffect(() => {
    getActivityTypeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      setStatesWithDBInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <GridContainer>
      {' '}
      <GridItem xs={12}>
        <Card>
          <Container>
            <Fragment>
              <h4>Editar Actividad </h4>
              <form style={{ display: !data && 'none' }} onSubmit={onSubmit}>
                <FormControl key={'gradeID'} className="custom-field-form">
                  <TextField
                    label={'Grado'}
                    variant="outlined"
                    size="small"
                    type="text"
                    value={gradeName || ''}
                    disabled={true}
                  />
                </FormControl>

                <FormControl
                  key={'selectedCalendarDay'}
                  className="custom-field-form"
                >
                  <TextField
                    label={'Día'}
                    variant="outlined"
                    size="small"
                    type="text"
                    value={dayNumber || ''}
                    disabled={true}
                  />
                </FormControl>

                <Fragment>
                  <FormControl key={'startDate'} className="custom-field-form">
                    <TextField
                      id="datetime-local"
                      label="Fecha inicio"
                      type="datetime-local"
                      value={calendarFormatStartDate}
                      required={true}
                      onChange={(e) => {
                        setStartDate(
                          moment(
                            e.target.value,
                            'YYYY-MM-DDTHH:mm',
                          ).toISOString(),
                        );
                        setCalendarFormatStartDate(e.target.value);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </FormControl>
                  <FormControl key={'endDate'} className="custom-field-form">
                    <TextField
                      id="datetime-local2"
                      label="Fecha final"
                      type="datetime-local"
                      value={calendarFormatEndDate}
                      required={true}
                      onChange={(e) => {
                        setEndDate(
                          moment(
                            e.target.value,
                            'YYYY-MM-DDTHH:mm',
                          ).toISOString(),
                        );
                        setCalendarFormatEndDate(e.target.value);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </FormControl>
                  <FormControl key={'name'} className="custom-field-form">
                    <TextField
                      label={'Nombre de actividad'}
                      variant="outlined"
                      size="small"
                      type="text"
                      value={name || ''}
                      onChange={(e) => setName(e.target.value)}
                      required={true}
                    />
                  </FormControl>
                  <FormControl
                    key={'description'}
                    className="custom-field-form"
                  >
                    <TextField
                      label={'Descripción de actividad'}
                      variant="outlined"
                      size="small"
                      type="text"
                      value={description || ''}
                      onChange={(e) => setDescription(e.target.value)}
                      required={true}
                    />
                  </FormControl>
                  <FormControl
                    key={'activityDuration'}
                    className="custom-field-form"
                  >
                    <TextField
                      label={'Duración Promedio (Minutos)'}
                      variant="outlined"
                      size="small"
                      type="number"
                      value={activityDuration || 0}
                      onChange={(e) => setActivityDuration(e.target.value)}
                      required={true}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </FormControl>
                  <FormControl key={'videoURL'} className="custom-field-form">
                    <TextField
                      label={'URL del video'}
                      variant="outlined"
                      size="small"
                      type="text"
                      value={videoURL || ''}
                      onChange={(e) => setVideoURL(e.target.value)}
                      required={true}
                    />
                  </FormControl>

                  {childQuestions.map((question, idx) => {
                    return (
                      <div
                        key={idx}
                        className={idx === 0 ? 'custom-field-form' : null}
                        style={{ marginBottom: idx !== 0 && '20px' }}
                      >
                        <TextField
                          label={`Pregunta del niño #${idx + 1}`}
                          variant="outlined"
                          size="small"
                          type="text"
                          value={question || ''}
                          onChange={(e) =>
                            childQuestionsModifier(idx, e.target.value)
                          }
                          required={true}
                          style={{ width: '70%' }}
                        />
                        {idx !== 0 && (
                          <Button
                            onClick={() => childQuestionRemover(idx)}
                            variant="contained"
                            style={{ width: '20%', marginLeft: '20px' }}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  <div className="custom-field-form">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setChildQuestions((prevChildQuestions) => [
                          ...prevChildQuestions,
                          '',
                        ]);
                      }}
                    >
                      Añadir Pregunta Niño
                    </Button>
                  </div>

                  {guideQuestions.map((question, idx) => {
                    return (
                      <div
                        key={idx}
                        className={idx === 0 ? 'custom-field-form' : null}
                        style={{ marginBottom: idx !== 0 && '20px' }}
                      >
                        <TextField
                          label={`Pregunta del guía #${idx + 1}`}
                          variant="outlined"
                          size="small"
                          type="text"
                          value={question || ''}
                          onChange={(e) =>
                            guideQuestionsModifier(idx, e.target.value)
                          }
                          required={true}
                          style={{ width: '70%' }}
                        />
                        {idx !== 0 && (
                          <Button
                            onClick={() => guideQuestionRemover(idx)}
                            variant="contained"
                            style={{ width: '20%', marginLeft: '20px' }}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  <div className="custom-field-form">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setGuideQuestions((prevGuideQuestions) => [
                          ...prevGuideQuestions,
                          '',
                        ]);
                      }}
                    >
                      Añadir Pregunta Guía
                    </Button>
                  </div>
                </Fragment>

                <Button type="submit" variant="contained" disabled={disabled}>
                  Editar
                </Button>
              </form>
            </Fragment>

            <br />
          </Container>
        </Card>
      </GridItem>{' '}
    </GridContainer>
  );
}

EditTopics.propTypes = {
  history: PropTypes.any,
  match: PropTypes.any,
};
