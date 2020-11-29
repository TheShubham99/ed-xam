import React, { Component } from 'react';
import './App.css';
import Tesseract from 'tesseract.js';


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      uploads: [],
      patterns: [],
      documents: [],
      score:0 ,
      keywords:[]
    };
  }

  handleChange = (event) => {
    if (event.target.files[0]) {
      var uploads = []
      for (var key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key]
        uploads.push(URL.createObjectURL(upload))
      }
      this.setState({
        uploads: uploads
      })
    } else {
      this.setState({
        uploads: []
      })
    }
  }

  handleKeywordChange = (e) => {
   // console.log(e.target.value);

   this.setState({
     keywords:e.target.value.toString().replaceAll(" ","").split(",")
    })

  }

  generateText = () => {
    let uploads = this.state.uploads
  
    for(var i = 0; i < uploads.length; i++) {
      console.log("file: "+uploads[i]);
      
      Tesseract.recognize(uploads[i],
        'eng',
        {
          logger: m=>console.log(m)
        }
      )
      .catch(err => {
        console.error(err)
      })
      .then(result => {
        console.log("Out: "+JSON.stringify(result['data'].text));
        
        // Get Confidence score
        let confidence = result.confidence
  
        // Get full output
        let text = result['data'].text
        console.log("output: "+text);
        // Get codes
        let pattern = /\b\w{10,10}\b/g
        let patterns = text.match(pattern);
  
        // Update state
        this.setState({ 
          patterns: this.state.patterns.concat(patterns),
          documents: this.state.documents.concat({
            pattern: patterns,
            text: text,
            confidence: confidence,
          })
        })
    
      })
    
    }
  }

  render() {
    return (
      
      <div className="app">
        
        <nav className={'navbar navbar-dark'}>
          <a className={"navbar-brand"}>Ed.Xam</a>
        </nav>

        
        <header className="header">
          <h1>Ed.Xam</h1>
          <br></br>
          <p><i>Ed.Xam is an AI based Exam Analysis tool that aseeses the solutions.</i></p>
        </header>

       
        { /* File uploader */ }
        <section className="hero">
          
          <label className="fileUploaderContainer">
            <b>Click here to upload test images.</b>
            <input type="file" id="fileUploader" onChange={this.handleChange} multiple />
          </label>


          <div>
          { 
          this.state.uploads.map((value, index) => {
            return <img key={index} src={value} width="100px" />
          }) 
          }
          </div>

          <label className="fileUploaderContainer">
            <p>
              <b>Enter keywords to match in the answer.</b>
            </p>

            <p style={{fontSize:'small'}}> 
              Note - Enter the keywords separated by comma (,).
            </p>                
              <textarea  placeholder="eg. Network, Server, Client, ..."  onChange={this.handleKeywordChange} style={{padding:0,margin:0, width:'100%', height:'3em',}}></textarea>
          </label>
          
          <button onClick={this.generateText} className="button">
            <span style={{fontSize:'large'}}>
            Analyze
            </span>
            </button>
        </section>


        { /* Results */ }
        <section className="results">
          { this.state.documents.map((value, index) => {
            
            var score;

            score=0;

            for(var i in this.state.keywords){
                
              score=score+value.text.split(this.state.keywords[i]).length-1;
            }


            console.log("Score "+score)
            return (
              <div key={index} className="results__result">

                <div className="results__result__info">
               
              <h5 style={{fontSize:'large',padding:'0.3em'}}>
                Student {index+1}
              </h5>

               <img width="50px" src="https://www.classifapp.com/wp-content/uploads/2017/09/avatar-placeholder.png" alt="user"></img>

               <div className="results__result__score">
                    <small><strong>Score:</strong> {((score/this.state.keywords.length)*100).toPrecision(5)}%</small>
                  </div>

                {/*   <div className="results__result__info__codes">
                    <small><strong>Confidence Score:</strong> {value.confidence}</small>
                  </div> */}


                  <div className="results__result__info__text">
                    <small><strong>Full Answer:</strong> {value.text}</small>
                  </div>
                </div>
              </div>
            )
          }) }
        </section>
      </div>
    )
  }

}

export default App;