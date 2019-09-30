import React, { PureComponent } from 'react';
import { Base64 } from 'js-base64';
import {
  Modal,
  Card,
  Steps,
  Button,
  message,
  Radio,
  notification,
  Input,
  Select,
  Tabs,
  Tooltip,
  Col,
  Row,
  Statistic,
  Icon,
  Alert,
} from 'antd';
import ReactHtmlParser from 'react-html-parser';
import brace from 'brace';
import {
  JAWABANSISWAPILGAN_KOSONG,
  JAWABANSISWAESSAY_KOSONG,
  QUERY_GET_MATERI_BERHASIL,
  QUERY_GET_SISWA_BY_NAME_SUCCESS,
} from '@/constants/status';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import { connect } from 'dva';

import AceEditor from 'react-ace';

import 'brace/mode/c_cpp';
import 'brace/snippets/c_cpp';
import 'brace/ext/language_tools';
import 'brace/ext/error_marker';
import 'brace/ext/beautify';
import 'brace/ext/static_highlight';
import 'brace/keybinding/vim';
import 'brace/theme/tomorrow';

import styles from './Workspace.less';

const { Step } = Steps;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ publics, user, compiler, loading }) => ({
  publics,
  user,
  compiler,
  compiling: loading.effects['compiler/rextesterCompile'],
  soalLoading: loading.effects['publics/getSoal'],
  materiLoading: loading.effects['publics/getMateri'],
}))
class Workspace extends PureComponent {
  state = {
    loading: true,
    currentSoalStep: 0,
    code: `#include <iostream>
    #include <string.h>
    using namespace std;
    int main(){
      //....
    }`,
    compilerType: 28,
    expectedOutput: '',
    maximumPoint: 100,
    maxLimitCompile: 3,
  };

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({
        loading: false,
      });

      const { dispatch } = this.props;

      dispatch({
        type: 'user/getJawabanEssay',
      });

      dispatch({
        type: 'user/getTimeHistory',
      });

      dispatch({
        type: 'user/getJawabanMultipleChoices',
      });

      this.aceEditor = React.createRef();

      const { publics } = this.props;
      if (publics && !publics.berandaStatus) {
        if (sessionStorage.getItem('soalCountDown')) {
          notification.info({
            message: 'Perhatikan Materi',
            description:
              'Ini merupakan bagian materi, silahkan pahami terlebih dahulu materi yang tersedia sebelum melanjutkan ke sesi soal.',
          });
        }
      }
    }, 600);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  onChangeCodeEditor = newValue => {
    this.setState({
      code: newValue,
    });
  };

  openClueSoal = (type, description) => {
    notification[type]({
      message: type === 'error' ? 'Jawaban Anda Salah' : 'Selamat, Jawaban Anda Benar!',
      description,
    });
  };

  handleJawaban = (e, idAnswer) => {
    let { value } = e.target;
    const { dispatch, user, publics } = this.props;
    value = JSON.parse(value);
    let answer = {};

    let { currentSoalStep } = this.state;
    let studentAnswer = [];

    const listMateri = publics && publics.materi.data && publics.materi.data.message;
    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;
    const currentIdMateri =
      (listBookmark && listBookmark[0].id_material) || (listMateri && listMateri[0].id);

    if (
      user &&
      user.jawabanMultipleChoices.data &&
      user.jawabanMultipleChoices.data.code !== JAWABANSISWAPILGAN_KOSONG
    ) {
      studentAnswer =
        user &&
        user.jawabanMultipleChoices.data &&
        user.jawabanMultipleChoices.data.message &&
        user.jawabanMultipleChoices.data.message[0].answers;

      studentAnswer = JSON.parse(studentAnswer);
    }

    let totalWrongAnswer =
      (studentAnswer && studentAnswer[value.index] && studentAnswer[value.index].totalError) || 0;

    let totalPoint =
      (studentAnswer && studentAnswer[value.index] && studentAnswer[value.index].totalPoint) || 10;

    if (!sessionStorage.getItem('soalCountDown')) {
      totalPoint = 0;
    }

    if (value.id_answer === idAnswer) {
      this.openClueSoal('success', value.clue);
      currentSoalStep += 1;
      this.setState({
        currentSoalStep,
      });

      answer = {
        dataValue: value,
        id_material: currentIdMateri,
        time: sessionStorage.getItem('soalCountDown'),
        totalError: totalWrongAnswer,
        totalPoint,
        isCorrect: true,
      };
    } else {
      this.openClueSoal('error', value.clue);

      if (totalWrongAnswer < 4) {
        totalWrongAnswer += 1;
      }

      switch (totalWrongAnswer) {
        case 0:
          totalPoint = 10;
          break;
        case 1:
          totalPoint = 9;
          break;
        case 2:
          totalPoint = 8;
          break;
        case 3:
          totalPoint = 7;
          break;
        default:
      }

      answer = {
        dataValue: value,
        id_material: currentIdMateri,
        time: sessionStorage.getItem('soalCountDown'),
        totalError: totalWrongAnswer,
        totalPoint,
        isCorrect: false,
      };
    }

    const newStudentAnswer = [...studentAnswer];
    newStudentAnswer[value.index] = answer;

    dispatch({
      type: 'user/updateJawabanMultipleChoices',
      payload: {
        answers: JSON.stringify(newStudentAnswer),
      },
    });
  };

  handleActiveInfo = (listMateri, listBookmark) => {
    if (listBookmark && listBookmark instanceof Array && listBookmark.length > 0) {
      return (
        listMateri &&
        listMateri.map(
          item =>
            item &&
            item.info.map(
              a =>
                listBookmark &&
                listBookmark.map(b => {
                  if (parseInt(a.id_material, 10) === parseInt(b.id_material, 10)) {
                    return ReactHtmlParser(`<p>${a.content}</p>`);
                  }
                  return ReactHtmlParser(`<p></p>`);
                })
            )
        )
      );
    }
    return listMateri && ReactHtmlParser(`<span>${listMateri[0].info[0].content}</span>`);
  };

  handleActiveMateri = (listMateri, listBookmark) => {
    if (listBookmark && listBookmark instanceof Array && listBookmark.length > 0) {
      return (
        listMateri &&
        listMateri.map(
          item =>
            item &&
            item.sub.map(
              a =>
                listBookmark &&
                listBookmark.map(b => {
                  if (parseInt(a.id, 10) === parseInt(b.id_material_sub, 10)) {
                    return ReactHtmlParser(`<p>${a.content}</p>`);
                  }
                  return ReactHtmlParser(`<p></p>`);
                })
            )
        )
      );
    }
    return listMateri && ReactHtmlParser(`<span>${listMateri[0].sub[0].content}</span>`);
  };

  onValidate = annotations => {};

  handleChangeCompiler = value => {
    this.setState({
      compilerType: value,
    });
  };

  handleBlurCompiler = value => {
    this.setState({
      compilerType: value,
    });
  };

  handleFocusCompiler = value => {
    this.setState({
      compilerType: value,
    });
  };

  handleStdin = e => {
    const { value } = e.target;
    this.setState({
      stdin: value,
    });
  };

  handleBtnRun = (e, data) => {
    let compilerArgs = '';
    const { dispatch } = this.props;
    const dataParse = JSON.parse(data);

    const { compilerType, code } = this.state;

    this.setState({
      expectedOutput: dataParse.expected_output,
    });

    switch (compilerType) {
      case '28':
        compilerArgs =
          'source_file.cpp -o a.exe /EHsc /MD /I C:\\boost_1_60_0 /link /LIBPATH:C:\\boost_1_60_0\\stage\\lib';
        break;
      case '27':
        compilerArgs = '-Wall -std=c++14 -stdlib=libc++ -O2 -o a.out source_file.cpp';
        break;
      case '7':
        compilerArgs = '-Wall -std=c++14 -O2 -o a.out source_file.cpp';
        break;
      default:
        compilerArgs =
          'source_file.cpp -o a.exe /EHsc /MD /I C:\\boost_1_60_0 /link /LIBPATH:C:\\boost_1_60_0\\stage\\lib';
    }

    const formData = new FormData();
    formData.append('LanguageChoice', compilerType);
    formData.append('Program', code);
    formData.append('Input', dataParse.stdin);
    formData.append('CompilerArgs', compilerArgs);

    dispatch({
      type: 'compiler/rextesterCompile',
      payload: formData,
    }).then(() => this.checkCompiler(data));
  };

  handleActiveSoal = () => {
    let nomorSoal = 0;
    const { publics, user } = this.props;
    let { currentSoalStep } = this.state;
    let latestAnswer = [];
    let getStudentAnswerEssay = [];

    if (
      user &&
      user.jawabanMultipleChoices.data &&
      user.jawabanMultipleChoices.data.code !== JAWABANSISWAPILGAN_KOSONG
    ) {
      latestAnswer =
        user &&
        user.jawabanMultipleChoices.data &&
        user.jawabanMultipleChoices.data.message &&
        user.jawabanMultipleChoices.data.message[0].answers;

      latestAnswer = JSON.parse(latestAnswer);
    }

    if (
      user &&
      user.jawabanEssay.data &&
      user.jawabanEssay.data.code !== JAWABANSISWAESSAY_KOSONG
    ) {
      getStudentAnswerEssay =
        user &&
        user.jawabanEssay.data &&
        user.jawabanEssay.data.message &&
        user.jawabanEssay.data.message[0].answers;

      getStudentAnswerEssay = JSON.parse(getStudentAnswerEssay);
    }

    currentSoalStep =
      this.getQuestFilterMultipleChoicesHelper('currentSoalStep') || currentSoalStep;
    currentSoalStep = parseInt(currentSoalStep, 10);

    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;
    const currentIdSubMateri = listBookmark && listBookmark[0].id_material_sub

    const data = user && user.timeHistory.data && user.timeHistory.data.code !== 'STATUS::TIME_HISTORY_KOSONG' && JSON.parse(user.timeHistory.data.message[0].data)
    const isTimeOut = data && data[currentIdSubMateri]

    const dataSoalPilgan =
      publics.soal &&
      publics.soal.data &&
      publics.soal.data.message.questions.map(c => {
        let dataPilgan = '';
        let dataEssay = '';
        const regex = /(?:^<p[^>]*>)|(?:<\/p>$)/g;

        dataPilgan =
          publics.soal &&
          publics.soal.data &&
          publics.soal.data.message.multiple_choices.map(d =>
            d.filter(e => e.id_question === c.id).map(f => (
              <RadioButton
                style={{
                  height: 'auto',
                  margin: '10px 0',
                  lineHeight: 'normal',
                  padding: '15px',
                }}
                key={`RadioButton${f.id}`}
                value={JSON.stringify({
                  id_answer: f.id,
                  id_question: c.id,
                  id_material_subs: c.id_material_subs,
                  type: 'multiple_choices',
                  index: c.id,
                  clue: f.clue,
                })}
              >
                {ReactHtmlParser(f.content.replace(regex, ''))}
              </RadioButton>
            ))
          );

        let { code } = this.state;
        const { compiling, compiler } = this.props;
        if (c.id_question_category === '2') {
          dataEssay = (
            <div className={styles.cppEditor}>
              <Tabs defaultActiveKey="1" tabPosition="left" size="small">
                <TabPane tab="Editor" key="1">
                  <AceEditor
                    placeholder="Tulis code anda disini"
                    mode="c_cpp"
                    theme="tomorrow"
                    name="blah2"
                    width="100%"
                    readOnly={currentSoalStep !== nomorSoal ||  isTimeOut==='timeout'}
                    onChange={this.onChangeCodeEditor}
                    onLoad={() => {
                      code =
                        (getStudentAnswerEssay &&
                          getStudentAnswerEssay.length > 0 &&
                          getStudentAnswerEssay[c.id] &&
                          Base64.decode(getStudentAnswerEssay[c.id].code)) ||
                        '';
                      if (code) {
                        this.setState({
                          code,
                        });
                      }
                    }}
                    value={code}
                    fontSize="12"
                    showPrintMargin
                    showGutter
                    highlightActiveLine
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 2,
                    }}
                  />
                  <Tooltip title="Field ini digunakan sebagai parameter inputan, misal terdapat 2 perintah cin, maka ada 2 data dipisahkan dengan enter. field ini sebagai pembanding apakah code yang anda sumbit benar atau tidak.">
                    <TextArea
                      onChange={this.handleStdin}
                      disabled
                      className={styles.cinArea}
                      defaultValue={c.stdin}
                      placeholder="Stdin"
                      autosize
                    />
                  </Tooltip>
                  <Tooltip title="Pilih compiler yang sesuai, jika mengandung library windows api misal windows.h dan sejenisnya gunakan vc++.">
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Pilih Compiler"
                      optionFilterProp="children"
                      disabled={currentSoalStep !== nomorSoal || isTimeOut==='timeout'}
                      onChange={this.handleChangeCompiler}
                      onFocus={this.handleFocusCompiler}
                      onBlur={this.handleBlurCompiler}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="28">C++ (Vc++)</Option>
                      <Option value="7">C++ (Gcc)</Option>
                      <Option value="27">C++ (Clang)</Option>
                    </Select>
                  </Tooltip>
                  <Button
                    type="primary"
                    icon="right-square"
                    disabled={currentSoalStep !== nomorSoal || isTimeOut==='timeout'}
                    loading={compiling}
                    className={styles.btnRun}
                    onClick={e =>
                      this.handleBtnRun(
                        e,
                        JSON.stringify({
                          id_material_subs: c.id_material_subs,
                          id_question: c.id,
                          expected_output: c.expected_output,
                          type: 'essay',
                          index: c.id,
                          stdin: c.stdin,
                          code,
                        })
                      )
                    }
                  >
                    Jalankan
                  </Button>
                </TabPane>
                <TabPane tab="Result" key="2">
                  <div style={{ whitespace: 'pre' }}>
                    {ReactHtmlParser(
                      (compiler &&
                        compiler.rextesterResult.Result &&
                        compiler.rextesterResult.Result.replace(/\n/g, '<br>')) ||
                        'Tidak ada result yang ditampilkan'
                    )}
                  </div>
                  <Alert
                    message="Untuk mengetahui benar atau tidaknya hasil compiler adalah dengan melihat hasil base64 berikut ini. jika hasil compiler sama dengan hasil yang diharapkan, maka code anda benar."
                    type="info"
                  />
                  <h4>Hasil Compiler (Base64)</h4>
                  <p style={{ wordBreak: 'break-all' }}>
                    {compiler && compiler.rextesterResult.Result && compiler.rextesterResult.Result
                      ? Base64.encode(
                          compiler &&
                            compiler.rextesterResult.Result &&
                            compiler.rextesterResult.Result
                        )
                      : 'Tidak ada result yang ditampilkan'}
                  </p>
                  <h4>Hasil Yang Diharapkan (Base64)</h4>
                  <p style={{ wordBreak: 'break-all' }}>{c.expected_output}</p>
                </TabPane>
                <TabPane tab="Error" key="3">
                  <div style={{ whitespace: 'pre' }}>
                    {ReactHtmlParser(
                      (compiler &&
                        compiler.rextesterResult.Errors &&
                        compiler.rextesterResult.Errors.replace(/\n/g, '<br>')) ||
                        'Tidak ada error yang ditampilkan'
                    )}
                  </div>
                </TabPane>
                <TabPane tab="Clue" key="4">
                  {ReactHtmlParser(c.clue_essay)}
                </TabPane>
              </Tabs>
            </div>
          );
        }

        dataPilgan = (
          <>
            {ReactHtmlParser(c.content.replace(regex, ''))}
            {dataEssay}
            <RadioGroup
              defaultValue={latestAnswer[c.id] ? JSON.stringify(latestAnswer[c.id].dataValue) : ''}
              disabled={currentSoalStep !== nomorSoal || isTimeOut==='timeout'}
              onChange={e => this.handleJawaban(e, c.id_answer)}
              key={`RadioGroup${c.id}`}
              style={{ padding: '0 30px' }}
            >
              {dataPilgan}
            </RadioGroup>
          </>
        );

        nomorSoal += 1;
        return (
          <Step
            key={`SoalNomor${nomorSoal}`}
            style={{
              opacity: (isTimeOut === 'timeout' || currentSoalStep !== nomorSoal - 1) ? '0.3' : '1',
            }}
            title={`Soal Nomor ${nomorSoal}`}
            description={dataPilgan}
          />
        );
      });

    return (
      <Steps key="StepDataSoalPilgan" current={currentSoalStep} direction="vertical">
        {dataSoalPilgan}
      </Steps>
    );
  };

  getDataSoal = (listMateri, listBookmark, dispatch) => {
    if (listBookmark && listBookmark instanceof Array && listBookmark.length > 0) {
      return (
        listMateri &&
        listMateri.map(
          item =>
            item &&
            item.sub.map(
              a =>
                listBookmark &&
                listBookmark.map(b => {
                  if (parseInt(a.id, 10) === parseInt(b.id_material_sub, 10)) {
                    dispatch({
                      type: 'publics/setTimeoutSoal',
                      payload: a.time,
                    });

                    dispatch({
                      type: 'publics/pauseCountDownSoal',
                      payload: {
                        status: false,
                        time: sessionStorage.getItem('soalCountDown') || 0,
                      },
                    });

                    dispatch({
                      type: 'publics/getSoal',
                      payload: {
                        id_material_subs: b.id_material_sub,
                      },
                    });
                  }
                  return false;
                })
            )
        )
      );
    }

    dispatch({
      type: 'publics/setTimeoutSoal',
      payload: listMateri[0].sub[0].time,
    });
    dispatch({
      type: 'publics/getSoal',
      payload: {
        id_material_subs: 1,
      },
    });

    return false;
  };

  getStep = currentStep => {
    const { publics, user, materiLoading, soalLoading } = this.props;
    const listMateri = publics && publics.materi.data && publics.materi.data.message;
    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;

    const steps = [
      {
        title: 'Intro',
        status: currentStep !== 0 ? 'wait' : '',
        content: (
          <Card className={styles.noBorder} loading={materiLoading}>
            {this.handleActiveInfo(listMateri, listBookmark)}
          </Card>
        ),
      },
      {
        title: 'Materi',
        status: currentStep !== 1 ? 'wait' : '',
        content: (
          <Card className={`${styles.noBorder}`} loading={materiLoading}>
            {this.handleActiveMateri(listMateri, listBookmark)}
          </Card>
        ),
      },
      {
        title: 'Soal',
        status: currentStep !== 2 ? 'wait' : '',
        content: (
          <Card className={styles.noBorder} loading={soalLoading}>
            {this.handleActiveSoal()}
          </Card>
        ),
      },
    ];
    return steps;
  };

  checkCompiler = data => {
    let answer = [];
    const { expectedOutput, maxLimitCompile } = this.state;
    const { compiler, compiling, dispatch, user, publics } = this.props;
    const compilerResult = compiler && compiler.rextesterResult && compiler.rextesterResult.Result;
    const dataParse = JSON.parse(data);
    let studentAnswerEssay = [];

    if (
      user &&
      user.jawabanEssay.data &&
      user.jawabanEssay.data.code !== JAWABANSISWAESSAY_KOSONG
    ) {
      studentAnswerEssay =
        user &&
        user.jawabanEssay.data &&
        user.jawabanEssay.data.message &&
        user.jawabanEssay.data.message[0].answers;
      studentAnswerEssay = JSON.parse(studentAnswerEssay);
    }

    const listMateri = publics && publics.materi.data && publics.materi.data.message;
    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;
    const currentIdMateri =
      (listBookmark && listBookmark[0].id_material) || (listMateri && listMateri[0].id);

    let totalWrongAnswer =
      (studentAnswerEssay &&
        studentAnswerEssay[dataParse.index] &&
        studentAnswerEssay[dataParse.index].totalError) ||
      0;

    let totalPoint =
      (studentAnswerEssay &&
        studentAnswerEssay[dataParse.index] &&
        studentAnswerEssay[dataParse.index].totalPoint) ||
      30;

    if (!sessionStorage.getItem('soalCountDown')) {
      totalPoint = 0;
    }

    if (compilerResult && !compiling) {
      if (
        !compiling &&
        Base64.encode(compilerResult) === expectedOutput &&
        !compiler.rextesterResult.Errors
      ) {
        answer = {
          dataValue: {
            id_question: dataParse.id_question,
            type: dataParse.type,
            id_material_subs: dataParse.id_material_subs,
            index: dataParse.index,
            stdin: dataParse.stdin,
            expected_output: dataParse.expected_output,
          },
          id_material: currentIdMateri,
          totalError: totalWrongAnswer,
          totalPoint,
          code: Base64.encode(dataParse.code),
          time: sessionStorage.getItem('soalCountDown'),
          isCorrect: true,
        };

        message.success('Selamat, code anda benar!');
      }

      if (
        !compiling &&
        Base64.encode(compilerResult) !== expectedOutput &&
        !compiler.rextesterResult.Errors
      ) {
        totalWrongAnswer += 1;

        if (totalWrongAnswer < maxLimitCompile) {
          switch (totalWrongAnswer) {
            case 0:
              totalPoint = 30;
              break;
            case 1:
              totalPoint = 28;
              break;
            case 2:
              totalPoint = 26;
              break;
            default:
          }
        }

        answer = {
          dataValue: {
            id_question: dataParse.id_question,
            type: dataParse.type,
            id_material_subs: dataParse.id_material_subs,
            index: dataParse.index,
            stdin: dataParse.stdin,
            expected_output: dataParse.expected_output,
          },
          id_material: currentIdMateri,
          code: Base64.encode(dataParse.code),
          time: sessionStorage.getItem('soalCountDown'),
          totalError: totalWrongAnswer,
          totalPoint,
          isCorrect: false,
        };

        message.error('Code anda salah silahkan cek kembali!');
      }
    }

    if (!compiling && compiler && compiler.rextesterResult && compiler.rextesterResult.Errors) {
      totalWrongAnswer += 1;

      if (totalWrongAnswer < maxLimitCompile) {
        switch (totalWrongAnswer) {
          case 0:
            totalPoint = 30;
            break;
          case 1:
            totalPoint = 28;
            break;
          case 2:
            totalPoint = 26;
            break;
          default:
        }
      }

      answer = {
        dataValue: {
          id_question: dataParse.id_question,
          type: dataParse.type,
          id_material_subs: dataParse.id_material_subs,
          index: dataParse.index,
          stdin: dataParse.stdin,
          expected_output: dataParse.expected_output,
        },
        id_material: currentIdMateri,
        code: Base64.encode(dataParse.code),
        totalError: totalWrongAnswer,
        totalPoint,
        time: sessionStorage.getItem('soalCountDown'),
        isCorrect: false,
      };

      message.error('Gagal mengcompile code, silahkan cek error di tab error');
    }

    if (
      !compiling &&
      compiler &&
      compiler.rextesterResult.Result === null &&
      compiler.rextesterResult.Errors === null
    ) {
      totalWrongAnswer += 1;

      if (totalWrongAnswer < maxLimitCompile) {
        switch (totalWrongAnswer) {
          case 0:
            totalPoint = 30;
            break;
          case 1:
            totalPoint = 28;
            break;
          case 2:
            totalPoint = 26;
            break;
          default:
        }
      }

      answer = {
        dataValue: {
          id_question: dataParse.id_question,
          type: dataParse.type,
          id_material_subs: dataParse.id_material_subs,
          index: dataParse.index,
          stdin: dataParse.stdin,
          expected_output: dataParse.expected_output,
        },
        id_material: currentIdMateri,
        code: Base64.encode(dataParse.code),
        totalError: totalWrongAnswer,
        totalPoint,
        time: sessionStorage.getItem('soalCountDown'),
        isCorrect: false,
      };
      message.error('Return kosong, pastikan anda me-return sesuatu di method utama');
    }

    studentAnswerEssay[dataParse.index] = answer;

    sessionStorage.setItem('studentAnswerEssay', JSON.stringify(studentAnswerEssay));

    dispatch({
      type: 'user/updateJawabanEssay',
      payload: {
        answers: JSON.stringify(studentAnswerEssay),
      },
    });
  };

  getQuestFilterMultipleChoicesHelper = action => {
    const { publics, user } = this.props;

    let isQuestionCompletedMultipleChoices = false;
    let isQuestionCompletedEssay = false;
    let returnData = false;
    let studentAnswerEssay = [];
    let studentAnswerEssayFilter = [];
    let studentAnswer = [];
    let studentAnswerFilter = [];

    const getQuestFilterEssay =
      publics &&
      publics.soal.data &&
      publics.soal.data.message.questions.filter(item => item && item.id_question_category === '2')
        .length;
    const getQuestFilterMultipleChoices =
      publics &&
      publics.soal.data &&
      publics.soal.data.message.questions.filter(item => item && item.id_question_category === '1')
        .length;

    let countStudentAnswerFilter = 0;
    let countStudentAnswerEssayFilter = 0;

    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;

    if (
      user &&
      user.jawabanMultipleChoices.data &&
      user.jawabanMultipleChoices.data.code !== JAWABANSISWAPILGAN_KOSONG
    ) {
      studentAnswer =
        user &&
        user.jawabanMultipleChoices.data &&
        user.jawabanMultipleChoices.data.message &&
        JSON.parse(user.jawabanMultipleChoices.data.message[0].answers);

      if (listBookmark && listBookmark instanceof Array && listBookmark.length > 0) {
        studentAnswerFilter =
          listBookmark &&
          listBookmark.some(
            a =>
              studentAnswer &&
              studentAnswer.filter(
                i => i && i.isCorrect === true && i.dataValue.id_material_subs === a.id_material_sub
              )
          );

        if (studentAnswerFilter) {
          studentAnswerFilter =
            listBookmark &&
            listBookmark.map(
              a =>
                studentAnswer &&
                studentAnswer.filter(
                  i =>
                    i && i.isCorrect === true && i.dataValue.id_material_subs === a.id_material_sub
                )
            );
          countStudentAnswerFilter = studentAnswerFilter[0].length;
        } else {
          countStudentAnswerFilter = studentAnswerFilter.length;
        }
      } else {
        studentAnswerFilter = studentAnswer && studentAnswer.filter(i => i && i.isCorrect === true);
        countStudentAnswerFilter = studentAnswerFilter.length;
      }

      isQuestionCompletedMultipleChoices =
        countStudentAnswerFilter === getQuestFilterMultipleChoices;
    }

    if (
      user &&
      user.jawabanEssay.data &&
      user.jawabanEssay.data.code !== JAWABANSISWAESSAY_KOSONG
    ) {
      studentAnswerEssay =
        user &&
        user.jawabanEssay.data &&
        user.jawabanEssay.data.message &&
        JSON.parse(user.jawabanEssay.data.message[0].answers);

      if (listBookmark && listBookmark instanceof Array && listBookmark.length > 0) {
        studentAnswerEssayFilter =
          listBookmark &&
          listBookmark.some(
            a =>
              studentAnswerEssay &&
              studentAnswerEssay.filter(
                i => i && i.isCorrect === true && i.dataValue.id_material_subs === a.id_material_sub
              )
          );

        if (studentAnswerEssayFilter) {
          studentAnswerEssayFilter =
            listBookmark &&
            listBookmark.map(
              a =>
                studentAnswerEssay &&
                studentAnswerEssay.filter(
                  i =>
                    i && i.isCorrect === true && i.dataValue.id_material_subs === a.id_material_sub
                )
            );
          countStudentAnswerEssayFilter = studentAnswerEssayFilter[0].length;
        } else {
          countStudentAnswerEssayFilter = studentAnswerEssayFilter.length;
        }
      } else {
        studentAnswerEssayFilter =
          studentAnswerEssay && studentAnswerEssay.filter(i => i && i.isCorrect === true);
        countStudentAnswerEssayFilter = studentAnswerEssayFilter.length;
      }

      isQuestionCompletedEssay = countStudentAnswerEssayFilter === getQuestFilterEssay;
    }
    
    const listMateri = publics && publics.materi.data && publics.materi.data.code === QUERY_GET_MATERI_BERHASIL  && publics.materi.data.message;
    const idLastMateri = listMateri && listMateri.length > 0  && listMateri[listMateri.length - 1].id;
    const idLastSubMateri =
      listMateri && listMateri.length > 0  &&
      listMateri[listMateri.length - 1].sub[listMateri[listMateri.length - 1].sub.length - 1].id;

    switch (action) {
      case 'isQuestionCompleted':
        if (
          idLastMateri === listBookmark[0].id_material &&
		
          idLastSubMateri === listBookmark[0].id_material_sub
        ) {
          returnData = false;
        } else if (getQuestFilterEssay > 0 && getQuestFilterMultipleChoices > 0) {
          returnData = isQuestionCompletedMultipleChoices && isQuestionCompletedEssay;
        } else if (getQuestFilterEssay > 0 && getQuestFilterMultipleChoices <= 0) {
          returnData = isQuestionCompletedEssay;
        } else if (getQuestFilterEssay <= 0 && getQuestFilterMultipleChoices > 0) {
          returnData = isQuestionCompletedMultipleChoices;
        } else {
          returnData = false;
        }
        break;
      case 'currentSoalStep':
        if (getQuestFilterEssay > 0 && getQuestFilterMultipleChoices > 0) {
          const returnDataEssay = countStudentAnswerEssayFilter;
          const returnDataMultipleChoices = countStudentAnswerFilter;

          returnData = returnDataEssay + returnDataMultipleChoices;
        } else if (getQuestFilterEssay > 0 && getQuestFilterMultipleChoices <= 0) {
          returnData = countStudentAnswerEssayFilter;
        } else if (getQuestFilterEssay <= 0 && getQuestFilterMultipleChoices > 0) {
          returnData = countStudentAnswerFilter;
        } else {
          returnData = 0;
        }
        break;
      default:
    }

    return returnData;
  };

  handleFinish(e, userPoint) {
    let getMateri = [];
    const { dispatch, publics, user } = this.props;
    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;
    const listMateri = publics && publics.materi.data && publics.materi.data.message;

    if (listBookmark && listMateri) {
      if (listBookmark && listBookmark instanceof Array && listBookmark.length > 0) {
        getMateri =
          listMateri && listMateri.filter(item => listBookmark[0].id_material === item.id);
        const currentMateri = listMateri.indexOf(getMateri[0]);
        const nextMateri = (currentMateri + 1) % listMateri.length;

        const currentMateriSub = getMateri[0].sub.filter(
          item => item.id === listBookmark[0].id_material_sub
        );
        const currentMateriSubIndex = getMateri[0].sub.indexOf(currentMateriSub[0]);
        const nextMateriSub = (currentMateriSubIndex + 1) % getMateri[0].sub.length;

        const idLastMateri = listMateri[listMateri.length - 1].id;
        const idLastSubMateri =
          listMateri[listMateri.length - 1].sub[listMateri[listMateri.length - 1].sub.length - 1]
            .id;

        const getLastSubMateri =
          listMateri && listMateri.filter(i => i.id === listBookmark[0].id_material);
        const getLastSubMateriID = getLastSubMateri[0].sub[getLastSubMateri[0].sub.length - 1].id;

        if (
          idLastMateri === listBookmark[0].id_material &&
          idLastSubMateri === listBookmark[0].id_material_sub
        ) {
          Modal.success({
            title: 'Anda Hebat!',
            content: 'Selamat anda telah menyesaikan semua soal dan materi',
          });
        } else if (getLastSubMateriID === listBookmark[0].id_material_sub) {
          dispatch({
            type: 'publics/setBerandaStatus',
            payload: true,
          });

          if (
            user &&
            user.currentUser.data &&
            user.currentUser.data.code === QUERY_GET_SISWA_BY_NAME_SUCCESS
          ) {
            dispatch({
              type: 'user/updatePoint',
              payload: {
                id_material: currentMateriSub[0] && currentMateriSub[0].id_material,
                id_material_sub: currentMateriSub[0] && currentMateriSub[0].id,
                id_class: user && user.currentUser && user.currentUser.data.message[0].class,
                point: userPoint < 75 ? 75 : userPoint,
              },
            });
          }
        } else {
          dispatch({
            type: 'user/updateBookmark',
            payload: {
              id_material: nextMateriSub > 0 ? getMateri[0].id : listMateri[nextMateri].id,
              id_material_sub:
                nextMateriSub > 0
                  ? getMateri[0].sub[nextMateriSub].id
                  : listMateri[nextMateri].sub[0].id,
            },
          });
        }
      } else {
        const currentMateriSub = listMateri[0].sub.indexOf(listMateri[0].sub[0]);
        const nextMateriSub = (currentMateriSub + 1) % listMateri[0].sub.length;

        dispatch({
          type: 'user/updateBookmark',
          payload: {
            id_material: listMateri[0].id,
            id_material_sub: listMateri[0].sub[nextMateriSub].id,
          },
        });
      }
    }

    dispatch({
      type: 'publics/handleFinish',
      payload: true,
    });

    dispatch({
      type: 'publics/setDashboardCurrentStep',
      payload: 1,
    });

    this.setState({
      currentSoalStep: 0,
    });

    sessionStorage.removeItem('soalCountDown');
  }

  next() {
    const { dispatch, publics, user } = this.props;
    let currentStep = publics && publics.dashboardCurrentStep;

    dispatch({
      type: 'publics/handleFinish',
      payload: false,
    });

    currentStep += 1;
    if (currentStep === 1) {
      notification.info({
        message: 'Perhatikan Materi',
        description:
          'Ini merupakan bagian materi, silahkan pahami terlebih dahulu materi yang tersedia sebelum melanjutkan ke sesi soal.',
        duration: 15,
      });
    }

    if (currentStep === 2) {
      const listMateri = publics && publics.materi.data && publics.materi.data.message;
      const listBookmark = user && user.bookmark.data && user.bookmark.data.message;

      this.getDataSoal(listMateri, listBookmark, dispatch);
      const currentIdSubMateri = listBookmark && listBookmark[0].id_material_sub

      const data = user && user.timeHistory.data && user.timeHistory.data.code !== 'STATUS::TIME_HISTORY_KOSONG' && JSON.parse(user.timeHistory.data.message[0].data)
      const isTimeOut = data && data[currentIdSubMateri]

      if(isTimeOut!=='timeout'){
        notification.warning({
          message: 'Sesi Soal',
          description: `Ini merupakan sesi soal, akan terdapat
          countdown waktu pengerjaan, semakin cepat anda mengerjakan dengan benar,
          maka nilai anda akan semakin baik.
          Akan ada pengurangan nilai jika anda menjawab salah,
          batas terendah nilai adalah nilai kkm.`,
          duration: 0,
        });
      }
    }

    dispatch({
      type: 'publics/setDashboardCurrentStep',
      payload: currentStep > 2 ? 0 : currentStep ,
    });
  }

  prev() {
    const { dispatch, publics } = this.props;
    let currentStep = publics && publics.dashboardCurrentStep;

    currentStep -= 1;

    dispatch({
      type: 'publics/setDashboardCurrentStep',
      payload: currentStep < 0 ? 0 : currentStep ,
    });
  }

  render() {
    const { user, publics } = this.props;
    const { loading } = this.state;
    const currentStep = publics && publics.dashboardCurrentStep;
    const steps = this.getStep(currentStep);

    const listMateri = publics && publics.materi.data && publics.materi.data.message;

    const listBookmark = user && user.bookmark.data && user.bookmark.data.message;

    const currentIdMateri =
      (listBookmark && listBookmark[0].id_material) || (listMateri && listMateri[0].id);
    const currentIdSubMateri =
      (listBookmark && listBookmark[0].id_material_sub) || (listMateri && listMateri[0].sub[0].id);

    const filterMateriById =
      listMateri && listMateri.filter(item => item && item.id === currentIdMateri);
    const filterSubMateriById =
      filterMateriById &&
      filterMateriById.map(item => item && item.sub.filter(i => i.id === currentIdSubMateri));

    let totalPointSubEssay = 0;
    let totalPointEssay = 0;
    let totalErrorEssay = 0;
    let pointTrueEssay = 0;
    if (user && user.jawabanEssay.status !== 'error') {
      const answerEssay =
        user && user.jawabanEssay.data && JSON.parse(user.jawabanEssay.data.message[0].answers);

      const studentTrueAnswerEssay =
        answerEssay &&
        answerEssay.filter(i => i && i.isCorrect === true && i.id_material === currentIdMateri);
      pointTrueEssay =
        studentTrueAnswerEssay &&
        studentTrueAnswerEssay.reduce((a, b) => +a + +(b.totalPoint || 0), 0);

      const filterEssay =
        answerEssay &&
        answerEssay.filter(item => item && item.dataValue.id_material_subs === currentIdSubMateri);
      totalPointSubEssay =
        filterEssay && filterEssay.reduce((a, b) => +a + +(b.totalPoint || 0), 0);

      const findAnswerEssayByIdMaterial =
        answerEssay && answerEssay.filter(item => item && item.id_material === currentIdMateri);
      totalPointEssay =
        findAnswerEssayByIdMaterial &&
        findAnswerEssayByIdMaterial.reduce((a, b) => +a + +(b.totalPoint || 0), 0);

      totalErrorEssay =
        findAnswerEssayByIdMaterial &&
        findAnswerEssayByIdMaterial.reduce((a, b) => +a + +(b.totalError || 0), 0);
    }

    let totalPointSubMultipleChoices = 0;
    let totalPointMultipleChoices = 0;
    let totalErrorMultipleChoices = 0;
    let pointTrueMultipleChoices = 0;
    if (user && user.jawabanMultipleChoices.status !== 'error') {
      const answerMultipleChoices =
        user &&
        user.jawabanMultipleChoices &&
        user.jawabanMultipleChoices.data &&
        JSON.parse(user.jawabanMultipleChoices.data.message[0].answers);

      const studentTrueAnswerMultipleChoices =
        answerMultipleChoices &&
        answerMultipleChoices.filter(
          i => i && i.isCorrect === true && i.id_material === currentIdMateri
        );
      pointTrueMultipleChoices =
        studentTrueAnswerMultipleChoices &&
        studentTrueAnswerMultipleChoices.reduce((a, b) => +a + +(b.totalPoint || 0), 0);

      const filterMultipleChoices =
        answerMultipleChoices &&
        answerMultipleChoices.filter(
          item => item && item.dataValue.id_material_subs === currentIdSubMateri
        );
      totalPointSubMultipleChoices =
        filterMultipleChoices &&
        filterMultipleChoices.reduce((a, b) => +a + +(b.totalPoint || 0), 0);

      const findAnswerMCByIdMaterial =
        answerMultipleChoices &&
        answerMultipleChoices.filter(item => item && item.id_material === currentIdMateri);
      totalPointMultipleChoices =
        findAnswerMCByIdMaterial &&
        findAnswerMCByIdMaterial.reduce((a, b) => +a + +(b.totalPoint || 0), 0);

      totalErrorMultipleChoices =
        findAnswerMCByIdMaterial &&
        findAnswerMCByIdMaterial.reduce((a, b) => +a + +(b.totalError || 0), 0);
    }

    const currentMateriName = filterMateriById && filterMateriById[0] && filterMateriById[0].name;
    const currentSubMateriName =
      filterSubMateriById &&
      filterSubMateriById[0] &&
      filterSubMateriById[0][0] &&
      filterSubMateriById[0][0].name;

    let totalNilai = 0;
    let totalNilaiPilgan = 0;
    let totalNilaiEssay = 0;

    let jumlahSoalPilgan =
      filterMateriById &&
      filterMateriById.map(
        i => i && i.sub.reduce((a, b) => +a + +(b.total_question_multiple_choices || 0), 0)
      );
    jumlahSoalPilgan = (jumlahSoalPilgan && jumlahSoalPilgan[0]) || 0;

    let jumlahSoalEssay =
      filterMateriById &&
      filterMateriById.map(
        i => i && i.sub.reduce((a, b) => +a + +(b.total_question_essay || 0), 0)
      );
    jumlahSoalEssay = (jumlahSoalEssay && jumlahSoalEssay[0]) || 0;

    if (jumlahSoalPilgan > 0 && jumlahSoalEssay > 0) {
      totalNilaiPilgan = (totalPointMultipleChoices / (10 * jumlahSoalPilgan)) * 40 || 0;
      totalNilaiEssay = (totalPointEssay / (30 * jumlahSoalEssay)) * 60 || 0;
      totalNilai = parseInt(totalNilaiPilgan, 10) + parseInt(totalNilaiEssay, 10);
    } else if (jumlahSoalPilgan <= 0 && jumlahSoalEssay > 0) {
      totalNilaiEssay = (totalPointEssay / (pointTrueEssay * jumlahSoalEssay)) * 100;
      totalNilai = parseInt(totalNilaiEssay, 10);
    } else if (jumlahSoalPilgan > 0 && jumlahSoalEssay <= 0) {
      totalNilaiPilgan =
        (totalPointMultipleChoices / (pointTrueMultipleChoices * jumlahSoalPilgan)) * 100;
      totalNilai = parseInt(totalNilaiPilgan, 10);
    }

    const pointSubMateri = totalPointSubMultipleChoices + totalPointSubEssay;
    const totalError = totalErrorMultipleChoices + totalErrorEssay;

    const data = user && user.timeHistory.data && user.timeHistory.data.code !== 'STATUS::TIME_HISTORY_KOSONG' && JSON.parse(user.timeHistory.data.message[0].data)
    const isTimeOut = data && data[currentIdSubMateri]

    return (
      <GridContent>
        {publics && !publics.berandaStatus ? (
          <div>
            <Row gutter={16}>
              <Col span={8} xs={24} sm={24} md={8}>
                <Card bodyStyle={{ margin: '5px 0' }} bordered={false}>
                  <Statistic
                    title={`${currentMateriName} (Total Nilai Sementara)`}
                    value={(totalNilai && totalNilai.toFixed(2)) || 0}
                    prefix={<Icon type="book" />}
                  />
                </Card>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Card bodyStyle={{ margin: '5px 0' }} bordered={false}>
                  <Statistic
                    title={`${currentSubMateriName} (Total Point)`}
                    value={(pointSubMateri && pointSubMateri.toFixed(2)) || 0}
                    prefix={<Icon type="form" />}
                  />
                </Card>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Card bodyStyle={{ margin: '5px 0' }} bordered={false}>
                  <Statistic
                    title="Total Menjawab Salah"
                    value={`${totalError || 0} Percobaan`}
                    prefix={<Icon type="close-square" />}
                  />
                </Card>
              </Col>
            </Row>
            <Card loading={loading} bordered={false} className={styles.stepWrapper}>
              <Steps current={currentStep}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </Card>
            <Card loading={loading} bordered={false}>
              <div className={styles.welcomeCard}>
                <div className={`steps-content ${styles.materiWrapper}`}>{steps[currentStep].content}</div>
                <div className={`steps-action ${styles.btnStepWrapper}`}>
                  {currentStep > 0 && (
                    <Button type="dashed" style={{ marginRight: 8 }} onClick={() => this.prev()}>
                      Sebelumnya
                    </Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button type="primary" onClick={() => this.next()}>
                      Selanjutnya
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button
                      disabled={this.getQuestFilterMultipleChoicesHelper('isQuestionCompleted') ? false : (isTimeOut !=='timeout') }
                      type="primary"
                      onClick={e =>
                        this.handleFinish(e, (totalNilai && totalNilai.toFixed(2)) || 0)
                      }
                    >
                      {currentStep < 2 ? 'Selanjutnya': 'Selesai'}
                    </Button>
                  )}
                </div>
                {}
              </div>
            </Card>
          </div>
        ) : (
          <Col xs={24} sm={24} md={18}>
            <Card>
              <h2>Selamat Datang</h2>
              <p>
               Halaman ini merupakan halaman workspace tempat Anda belajar, mempelajari materi dan mengerjakan soal evaluasi. Untuk memulai silahkan pilih salah satu dari materi pada menu side bar. </p>
<p><b>Mohon diperhatikan</b>, jika Anda sudah memilih salah satu materi pada menu side bar, Anda harus menyelesaikan materi tersebut sampai habis dan Anda tidak bisa melompati bingkai materi selanjutnya atau materi lain sebelum Anda menyelesaikan materi dan soal evaluasi yang telah disediakan.
              </p>

              <div>
                Sebelum masuk ke materi, silahkan baca informasi dibawah ini:
                <ul style={{ listStyle: 'decimal', margin: '20px', padding: 0 }}>
                  <li>
                    Silahkan Anda pelajari dahulu petunjuk penggunaan pada website pada menu <b>Petunjuk Penggunaan</b> atau dengan klik <a href="http://digitalcamp.id/dashboard/how-to-use#"> http://digitalcamp.id/dashboard/how-to-use# </a> atau petunjuk penggunaan pada manual book sebelum mulai mempelajari materi dan mengerjakan soal evaluasi.
                  </li>
                  <li>
                    Anda dapat mempelajari materi video pada menu <b>Video</b> atau klik <a href="http://digitalcamp.id/dashboard/videos#">http://digitalcamp.id/dashboard/videos#</a>
                  </li>
                  <li>
                    Anda tidak bisa melompati atau berpindah ke bingkai materi selanjutnya atau materi lain sebelum Anda menyelesaikan materi dan soal evaluasi pada materi tersebut.
                  </li>
                  <li>
		    Terdapat batas waktu ketika Anda mulai mengerjakan soal evaluasi.
                  </li>
		  <li>
	            Pada soal evaluasi pilihan ganda terdapat 4 kali percobaan dan soal evaluasi essay terdapat 3 kali percobaan, dimana tiap percobaan salah akan mengurangi point.
                  </li>
                  <li>
		    Untuk soal evaluasi essay berupa live coding, Anda dapat memilih salah satu diantara 3 compiler C++. Coba pilih compiler yang sesuai jika memang kode program jawaban Anda menghasilkan error.
		  </li>
                  <li>
	            Silahkan tanyakan jika ada yang masih ragu atau bingung kepada guru atau admin.
                  </li>
                </ul>
              </div>
            </Card>
          </Col>
        )}
      </GridContent>
    );
  }
}

export default Workspace;
