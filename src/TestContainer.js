import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import ReactTestUtils from 'react-addons-test-utils'
import CodeMirror from 'react-codemirror'
import { transform } from 'babel-standalone'

import 'codemirror/mode/jsx/jsx';

// import CodeMirrorModeMeta from 'codemirror/mode/meta.js';
// import CodeMirrorLoadMode from 'codemirror/addon/mode/loadmode.js';
// import 'codemirror-jsx/replace-js';

export default class TestComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			code: this.props.seedCode,
			testResults: []
		}
		this.updateCode = this.updateCode.bind(this);
		this.liveRender = this.liveRender.bind(this);
		this.testCode = this.testCode.bind(this);
		this.seedCode = this.seedCode.bind(this);
		this.solutionCode = this.solutionCode.bind(this);
	}
  updateCode(newCode) {
    this.setState({
        code: newCode
    });
    this.liveRender();
	}
	liveRender() {

		const { code } = this.state;
		const renderComponent = this.props.liveRender(code);

		ReactDOM.render(renderComponent, document.getElementById('liveOutput'));

	}
	testCode() {

		const { code } = this.state;
		const results = this.props.executeTests(code);

		this.setState({
			passed: results.passed,
			testResults: results.testResults
		});

	}
	seedCode() {
		this.setState({
			code: this.props.seedCode
		});
		setTimeout( () => { this.liveRender() }, 50);
	}
	solutionCode() {
		this.setState({
			code: this.props.solutionCode
		});
		setTimeout( () => { this.liveRender() }, 50);
	}
	componentDidMount() {
		this.testCode();
		this.liveRender();
	}
	render() {
    const options = {
    	mode: 'jsx',
      lineNumbers: true,
      theme: 'monokai',
      fontSize: '30px'
    };
    const renderTitle = () => { return { __html: this.props.challengeTitle }}
    const renderInstructions = () => { return { __html: this.props.challengeInstructions }}
    const { testResults } = this.state;
    
    let passingTests, totalTests
    if (testResults.length > 0) {
	    passingTests = testResults.filter( (test) => test.status === true ).length;
	    totalTests = testResults.length;
    }
    
    return (
    	<div>

    		<h1 className = 'title'>Free Code Camp React/Redux Challenge Demo:</h1>

    		<div className = 'instructionsContainer'>
					<h1 className = 'title' dangerouslySetInnerHTML = {renderTitle()} />
					<p className = 'instructions' dangerouslySetInnerHTML = {renderInstructions()} />
    		</div>

    		<h1 className = 'title'>Code:</h1>

	    	<CodeMirror
	    		className = 'editor'
	    		value = {this.state.code}
	    		onChange = {this.updateCode}
	    		options = {options} />

	    	<div className = 'outputContainer'>
		    	<h1 className = 'outputTitle'>Live Output:</h1>
		    	<div id = 'liveOutput'></div>
		    </div>

		    <h1 className = 'title'>Run Tests:</h1>
	    	
	    	<div className = 'testControls'>
	    		<button onClick = {this.testCode} className = 'testBtn'>Test Code</button>
	    		<button onClick = {this.seedCode}>Reload Seed</button>
	    		<button onClick = {this.solutionCode}>Solution Code</button>
		    </div>

		    <div className = 'testResults'>
		    	<h1 className = 'default resultsTitle'>Results:
						{ this.state.passed ?
	    				<span className = 'msg success'>All tests passed!</span> :
	    				<span className = 'msg error'>Your code does not pass the tests, {passingTests} out of {totalTests} tests are passing</span> }
		    	</h1>
		    	
		    	{
		    		testResults.map( (test, idx) => {
			    		if (test.status) {
			    			return (
			    				<p className = 'test testSuccess' key = {idx}>
			    					<i className="fa fa-check" aria-hidden="true"></i>
			    					{test.success}
			    				</p>
			    			)
			    		} else {
				    		return (
				    			<p className = 'test testFailure' key = {idx}>
			    					<i className="fa fa-times" aria-hidden="true"></i>
			    					{test.failure}
			    				</p>
				    		)
				    	}
			    	})
		    	}

		    </div>

    	</div>
    );
	}
};