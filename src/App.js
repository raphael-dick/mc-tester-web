import React, { useState, useEffect, useRef } from 'react';

function App() {

  const [ fileUrl, setFileUrl ] = useState("https://gist.githubusercontent.com/raphael-dick/37008f9033ebb7ef3eb664f03fb480b9/raw/5978f62ccdc95d6043281840f190bf94ec14049f/mc-tester-web-gbu.json")
  //const [ fileUrl, setFileUrl ] = useState("")

  const [ questions, setQuestions ] = useState([])
  const [ showRightAnswer, setShowRightAnswer ] = useState(false)
  const [ currentQuestion, setCurrentQuestion ] = useState(undefined)
  const [ answeredQuestions, setAnsweredQuestions ] = useState([])
  const [ wrongQuestions, setWrongQuestions ] = useState([])

  const [ error, setError ] = useState(undefined)

  const form = useRef(null)

  useEffect(() => {
    if(!fileUrl) return

    fetch(fileUrl).then(data => {
      return data.json()
    }).then(data => {
      if(!Array.isArray(data)) {
        return setError("Not a valid File")
      }
      setQuestions(data)
      nextQuestion()
    })
  }, [fileUrl])

  const nextQuestion = () => {
    const question = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(question)
  }

  console.log("Answered:", answeredQuestions.length);
  console.log("All:", questions.length);

  const checkQuestion = () => {
    const checkboxes = form.current.querySelectorAll("input")

    const rightids = currentQuestion.rightids.split("").map(x => Number(x))

    let fail = false

    checkboxes.forEach(checkbox => {
      // console.log(checkbox.id, ":", checkbox.checked, " should be", rightids.includes( Number(checkbox.id) + 1));
      const checked = checkbox.checked
      checkbox.checked = false
      if(rightids.includes( Number(checkbox.id) + 1 ) !== checked) {
        fail = true
        return
      }
    });

    if(!fail) {
      setAnsweredQuestions([ currentQuestion, ...answeredQuestions ])
      // const tempQuestions = [...questions]
      // tempQuestions.splice(tempQuestions.indexOf(currentQuestion), 1);

      const tempQuestions = questions.filter(item => item.q !== currentQuestion.q)
      setQuestions(tempQuestions)
      nextQuestion()
    } else {
      setShowRightAnswer(true)
    }
  }

  const FileUrlInput = () => {
    const [ url, setUrl ] = useState("https://gist.githubusercontent.com/raphael-dick/37008f9033ebb7ef3eb664f03fb480b9/raw/5978f62ccdc95d6043281840f190bf94ec14049f/mc-tester-web-gbu.json")

    return (
      <>
        <input type="text" value={ url } onChange={e => setUrl(e.target.value) } />
        <button onClick={ () => setFileUrl( url ) }>load</button>
      </>
    )
  }

  if(!fileUrl) {
    return( <FileUrlInput /> )
  }

  return (
    <div className="App">
      {
        !currentQuestion ?
          <>
            <h3>GBU MC Lerntool:</h3>
            <p style={{textAlign: 'center'}}>Die Fragen kommen aus dem Fragenkatalog von <a href="https://github.com/stiefel40k/PythonMCTester/">https://github.com/stiefel40k/PythonMCTester</a></p>
            <i style={{textAlign: 'center'}}>Daher auch keine Garantie für Richitgkeit! <br/>Fehler können mit gerne gemeldet werden (Whatsappgruppe)</i>
            <p style={{textAlign: 'center'}}>Bereits einmal richtig beantwortete Fragen kommen während dieser Session nicht erneut, ansonsten ist das Tool dumm.</p>
            <button onClick={nextQuestion}>START</button>
          </>
        : showRightAnswer ?
          <>
            <p style={{color: 'red', padding: 0, margin: 0}}>Fehler: {currentQuestion.q}</p>
            <form ref={form} disabled>
            { currentQuestion.answers.map(( q, i ) =>
              <div key={i}>
                <input type="checkbox" id={i} checked={currentQuestion.rightids.includes(q.id)} />
              <label>{q.text}</label>
              </div>
            )}
            </form>
            <button onClick={() => { setShowRightAnswer(false); nextQuestion() }}>weiter</button>
          </>
        :
          <>
            {currentQuestion.q}

            <form ref={form}>
              { currentQuestion.answers.map(( q, i ) => <div key={i}><input type="checkbox" id={i} /><label htmlFor={i}>{q.text}</label></div>)}
            </form>

            <button onClick={checkQuestion}>check</button>

          </>
      }
    </div>
  );
}

export default App;
