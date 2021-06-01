import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../../assets/constants/url';
import GridContainer from 'components/defaultComponents/Grid/GridContainer';
import GridItem from 'components/defaultComponents/Grid/GridItem';
import {
  Button,
  Card,
  Container,
  FormControl,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import moment from 'moment';
import CustomToast from '../../components/myComponents/custom-toast';
import { toast } from 'react-toastify';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function AddTopics(props) {
  const { operation } = props.match.params;
  const entityID = JSON.parse(localStorage.getItem('entity'))._id;
  const userID = JSON.parse(localStorage.getItem('user'))._id;
  const [disabled, setDisabled] = useState(true);
  const [childQuestions, setChildQuestions] = useState(['']);
  const [guideQuestions, setGuideQuestions] = useState(['']);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [calendarDayOptions, setCalendarDayOptions] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [calendarFormatStartDate, setCalendarFormatStartDate] = useState(null);
  const [calendarFormatEndDate, setCalendarFormatEndDate] = useState(null);
  const [description, setDescription] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [name, setName] = useState('');
  const [gradeName, setGradeName] = useState('');
  const [activityDuration, setActivityDuration] = useState(0);

  const getAllGradesByEntity = async () => {
    try {
      // this request returns all option of the different grades along with the id;
      const res = await axios.get(
        `${URL}/api/test/calendar-day/${entityID}`,
        config,
      );
      setGradeOptions(res.data.keysLabel[0].options);
      setDisabled(false);
      console.log(res.data);
    } catch (err) {
      setDisabled(true);
      console.log(err);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (startDate < endDate) {
      const activityTypeInfo = {
        entityID,
        gradeID: props.location.state
          ? props.location.state.gradeName.value
          : selectedGrade,
        calendarDayID: props.location.state
          ? props.location.state.dayNumber.value
          : selectedCalendarDay,
        videoURL: videoURL.trim(),
        name: name.trim(),
        description: description.trim(),
        childQuestions,
        guideQuestions,
        createdBy: userID,
        updatedBy: userID,
        gradeName: gradeName.trim(),
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
          `${URL}/api/calendar/create-activity-type`,
          body,
          config,
        );
        toast(<CustomToast title={res.data} />);
        props.history.replace('/admin/activity-type');
      } catch (e) {
        setDisabled(false);
        toast(<CustomToast title={e.response.data} />);
        console.log(e);
      }
    } else {
      toast(
        <CustomToast title="La fecha inicial no puede ser mayor a la final." />,
      );
    }
  };

  const handleGradeSelection = async (v) => {
    if (v.value) {
      setSelectedGrade(v.value);
      setGradeName(v.title);
      setDisabled(true);
      try {
        const res = await axios.get(
          `${URL}/api/test/calendar-day-by-grade-id/${v.value}`,
          config,
        );
        setCalendarDayOptions(res.data);
        setDisabled(false);
      } catch (e) {
        setDisabled(true);
        console.log(e);
      }
    }
  };

  const handleGradeSelectionWithProps = async (v) => {
    if (v.value) {
      setDisabled(true);
      try {
        const res = await axios.get(
          `${URL}/api/test/calendar-day-by-grade-id/${v.value}`,
          config,
        );
        setCalendarDayOptions(res.data);
        setDisabled(false);
      } catch (e) {
        setDisabled(true);
        console.log(e);
      }
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

  useEffect(() => {
    getAllGradesByEntity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.location.state) {
      console.log(props.location.state);
      setSelectedGrade(props.location.state.gradeName);
      handleGradeSelectionWithProps(props.location.state.gradeName);
      setSelectedCalendarDay(props.location.state.dayNumber);
      setGradeName(props.location.state.gradeName.title);
      console.log('entré');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(selectedGrade, 'selected');
    console.log(gradeName, 'selected');
  }, [selectedGrade, gradeName]);

  return (
    <GridContainer>
      {' '}
      <GridItem xs={12}>
        <Card>
          <Container>
            {operation === 'add' && (
              <Fragment>
                <h4>Nueva Actividad </h4>
                <form onSubmit={onSubmit}>
                  {props.location.state ? (
                    <div
                      className="custom-field-form"
                      style={{ width: '100%' }}
                    >
                      <FormControl
                        className="custom-field-form"
                        key={'selectedGrade'}
                      >
                        <Autocomplete
                          size="small"
                          disabled={props.location.state && true}
                          options={gradeOptions}
                          value={props.location.state && selectedGrade}
                          getOptionLabel={(option) => option.title}
                          onChange={(e, v) => {
                            setSelectedCalendarDay(null);
                            setCalendarDayOptions([]);
                            if (v) {
                              handleGradeSelection(v);
                            } else {
                              setSelectedGrade(null);
                              setGradeName('');
                              setCalendarDayOptions([]);
                              setSelectedCalendarDay(null);
                            }
                          }}
                          style={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={'Grado'}
                              variant="outlined"
                              required={true}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  ) : (
                    <div
                      className="custom-field-form"
                      style={{ width: '100%' }}
                    >
                      <FormControl
                        className="custom-field-form"
                        key={'selectedGrade'}
                      >
                        <Autocomplete
                          size="small"
                          options={gradeOptions}
                          getOptionLabel={(option) => option.title}
                          onChange={(e, v) => {
                            setSelectedCalendarDay(null);
                            setCalendarDayOptions([]);
                            if (v) {
                              handleGradeSelection(v);
                            } else {
                              setSelectedGrade(null);
                              setGradeName('');
                              setCalendarDayOptions([]);
                              setSelectedCalendarDay(null);
                            }
                          }}
                          style={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={'Grado'}
                              variant="outlined"
                              required={true}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  )}

                  {calendarDayOptions.length > 0 && props.location.state ? (
                    <div
                      className="custom-field-form"
                      style={{ width: '100%' }}
                    >
                      <FormControl
                        key={'selectedCalendarDay'}
                        className="custom-field-form"
                      >
                        <Autocomplete
                          size="small"
                          disabled={props.location.state && true}
                          value={props.location.state && selectedCalendarDay}
                          options={calendarDayOptions}
                          getOptionLabel={(option) => option.title}
                          onChange={(e, v) =>
                            setSelectedCalendarDay(v?.value || null)
                          }
                          style={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={'Día'}
                              variant="outlined"
                              required={true}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  ) : calendarDayOptions.length > 0 && !props.location.state ? (
                    <div
                      className="custom-field-form"
                      style={{ width: '100%' }}
                    >
                      <FormControl
                        key={'selectedCalendarDay'}
                        className="custom-field-form"
                      >
                        <Autocomplete
                          size="small"
                          options={calendarDayOptions}
                          getOptionLabel={(option) => option.title}
                          onChange={(e, v) =>
                            setSelectedCalendarDay(v?.value || null)
                          }
                          style={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={'Día'}
                              variant="outlined"
                              required={true}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  ) : (
                    Boolean(
                      selectedGrade && calendarDayOptions.length === 0,
                    ) && (
                      <div style={{ marginBottom: '20px' }}>
                        Este grado no tiene días en el calendario.
                      </div>
                    )
                  )}
                  {Boolean(selectedCalendarDay && selectedGrade) && (
                    <Fragment>
                      <FormControl
                        key={'startDate'}
                        className="custom-field-form"
                      >
                        <TextField
                          id="datetime-local"
                          label="Fecha inicio"
                          type="datetime-local"
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
                      <FormControl
                        key={'endDate'}
                        className="custom-field-form"
                      >
                        <TextField
                          id="datetime-local2"
                          label="Fecha final"
                          type="datetime-local"
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
                      <FormControl
                        key={'videoURL'}
                        className="custom-field-form"
                      >
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
                  )}
                  <Button type="submit" variant="contained" disabled={disabled}>
                    Guardar
                  </Button>
                </form>
              </Fragment>
            )}
            <br />
          </Container>
        </Card>
      </GridItem>{' '}
    </GridContainer>
  );
}

AddTopics.propTypes = {
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
};
