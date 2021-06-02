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
import CheckIcon from '../../assets/img/check-icon.ico';
import CrossIcon from '../../assets/img/delete-icon.png';
import moment from 'moment';
import CustomToast from '../../components/myComponents/custom-toast';
import { toast } from 'react-toastify';

export default function AddTopics(props) {
  const [disabled, setDisabled] = useState(true);
  const [topicQuestions, setTopicQuestions] = useState([{question: '', choices: [{name: '', correct: true}, {name: '', correct: false}]}]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [description, setDescription] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [name, setName] = useState('');

  console.log(topicQuestions);

  const getAllCourses = async () => {
    try {
      const jwt = localStorage.getItem('session');
      const authConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.get(
        `${URL}/course/admin/getAllCourses`,
        authConfig,
      );
      setCourseOptions(res.data.modifiedCourse);
      setDisabled(false);
    } catch (err) {
      setDisabled(true);
      if (err.response.status === 401) {
        localStorage.removeItem('session');
        window.location.href = '/';
      }
      console.log(err);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // handle submit
  };


  const topicQuestionRemover = (idx) => {
    setTopicQuestions((prevTopicQuestions) =>
      prevTopicQuestions.filter((question, index) => index !== idx),
    );
  };

  const topicQuestionsModifier = (idx, e) => {
    setTopicQuestions((prevQuestions) => {
      let newQuestions = [...prevQuestions];
      newQuestions[idx].question = e;
      return newQuestions;
    });
  };

  const handleAddOption = (questionIdx) => {
    setTopicQuestions((prevTopicQuestions) => {
      let copyOfQuestions = [...prevTopicQuestions];
      copyOfQuestions[questionIdx].choices = [...copyOfQuestions[questionIdx].choices, {name: '', correct: false}];
      return copyOfQuestions;

    });
  };

  const handleDeleteOption = (questionIdx, choiceIdx) => {
    setTopicQuestions((prevTopicQuestions) => {
      let copyOfQuestions = [...prevTopicQuestions];
      copyOfQuestions[questionIdx].choices.splice(choiceIdx,1);
      return copyOfQuestions;
    });
  };

  const  topicOptionModifier = (questionIdx, choiceIdx, e) => {
    setTopicQuestions((prevTopicQuestions) => {
      let copyOfQuestions = [...prevTopicQuestions];
      copyOfQuestions[questionIdx].choices[choiceIdx].name = e;
      return copyOfQuestions;
    });
  };

  const handleChangeCorrectOption = (questionIdx, choiceIdx) => {
    setTopicQuestions((prevTopicQuestions) => {
      let copyOfQuestions = [...prevTopicQuestions];
      const choices = copyOfQuestions[questionIdx].choices;
      for (let i = 0; i<choices.length; i++) {
        if (i === choiceIdx) {
          copyOfQuestions[questionIdx].choices[i].correct = true;
          continue;
        } 
        copyOfQuestions[questionIdx].choices[i].correct = false;
      }
      return copyOfQuestions;
    });
  };

  useEffect(() => {
    getAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <Container>
            <Fragment>
              <h4>New Topic </h4>
              <form onSubmit={onSubmit}>
                <div
                  className="custom-field-form"
                  style={{ width: '100%' }}
                >
                  <FormControl
                    className="custom-field-form"
                    key={'selectedCourse'}
                  >
                    <Autocomplete
                      size="small"
                      options={courseOptions}
                      getOptionLabel={(option) => option.title}
                      onChange={(e, v) => {
                        if (v) {
                          setSelectedCourse(v.value);
                        } else {
                          setSelectedCourse(null);
                        }
                      }}
                      style={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={'Course'}
                          variant="outlined"
                          required={true}
                        />
                      )}
                    />
                  </FormControl>
                </div>
                {Boolean(selectedCourse) && (
                  <Fragment>
              
                    <FormControl key={'name'} className="custom-field-form">
                      <TextField
                        label={'Topic name'}
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
                        label={'Topic description'}
                        variant="outlined"
                        size="small"
                        type="text"
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        required={true}
                      />
                    </FormControl>
                    <FormControl
                      key={'videoURL'}
                      className="custom-field-form"
                    >
                      <TextField
                        label={'Video URL'}
                        variant="outlined"
                        size="small"
                        type="text"
                        value={videoURL || ''}
                        onChange={(e) => setVideoURL(e.target.value)}
                        required={true}
                      />
                    </FormControl>
                    <div style={{fontWeight: 'bold', marginBottom: '20px'}}>Multiple choice, only one correct answer!</div>

                    {topicQuestions.map((question, idx) => {
                      const choices = question.choices;
                      return (
                        <div
                          key={idx}
                          className={idx === 0 ? 'custom-field-form' : null}
                          style={{ marginBottom: idx !== 0 && '20px' }}
                        >
                          <TextField
                            label={`Topic question #${idx + 1}`}
                            variant="outlined"
                            size="small"
                            type="text"
                            value={question.question || ''}
                            onChange={(e) =>
                              topicQuestionsModifier(idx, e.target.value)
                            }
                            required={true}
                            style={{ width: '70%', marginBottom: '20px' }}
                          />
                          {idx !== 0 && (
                            <Button
                              onClick={() => topicQuestionRemover(idx)}
                              variant="contained"
                              style={{ width: '20%', marginLeft: '20px' }}
                            >
                                Delete Question
                            </Button>
                          )}
                          {
                            choices.map((choice, choiceIdx) => {
                              return (<div  key={choiceIdx}
                
                                style={{ marginBottom:  '20px', display: 'flex', alignItems: 'center' }}> <TextField
                                  label={`Question #${idx+1} Option #${choiceIdx + 1}`}
                                  variant="outlined"
                                  size="small"
                                  type="text"
                                  value={choice.name|| ''}
                                  onChange={(e) =>
                                    topicOptionModifier(idx, choiceIdx, e.target.value)
                                  }
                                  required={true}
                                  style={{ width: '70%' }}
                                />
                                <img
                                  alt=""
                                  src={choice.correct ? CheckIcon : CrossIcon}
                                  style={{ width: '25px', height: '25px', marginLeft: '10px' }}
                                />
                              
                                {!choice.correct &&  <Button
                                  onClick={() => handleChangeCorrectOption(idx, choiceIdx)}
                                  variant="contained"
                                  style={{ width: '100px', marginLeft: '20px' }}
                                >
                                Correct
                                </Button>}
                                {choiceIdx > 1 &&(  <Button
                                  onClick={() => handleDeleteOption(idx, choiceIdx)}
                                  variant="contained"
                                  style={{ width: '100px', marginLeft: '20px' }}
                                >
                                Delete
                                </Button>) }
                              </div>);
                            })
                          }
                          <div className="custom-field-form">
                            <Button
                              variant="contained"
                              onClick={() => handleAddOption(idx)}
                            >
                          Add Option
                            </Button>
                          </div>
                        
                        </div>
                      );
                    })}
                    <div className="custom-field-form">
                      <Button
                        variant="contained"
                        onClick={() => {
                          setTopicQuestions((prevTopicQuestions) => [
                            ...prevTopicQuestions,
                            {question: '', choices: [{name: '', correct: true}, {name: '', correct: false}]},
                          ]);
                        }}
                      >
                          Add Topic Question
                      </Button>
                    </div>

                  </Fragment>
                )}
                <Button type="submit" variant="contained" disabled={disabled}>
                    Save
                </Button>
              </form>
            </Fragment>
            <br />
          </Container>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

AddTopics.propTypes = {
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
};
