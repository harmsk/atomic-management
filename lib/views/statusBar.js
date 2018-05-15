'use babel';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

export default class StatusBar extends Component {

    static propTypes = {
        statusBar: PropTypes.object.isRequired,
        tooltips: PropTypes.object.isRequired,
        projectConfigs: PropTypes.array.isRequired,
        onReorder: PropTypes.func.isRequired,
        onCheck: PropTypes.func.isRequired,
        enabledConfigs: PropTypes.array.isRequired,
    }

    setChecked(projects, enabled) {
      var checked=[]
      projects.forEach((file) => {
          if(enabled.includes(file)) {
              checked.push(true)
          }
          else {
              checked.push(false)
          }
      })
      checked.push(true)
      this.setState({checked})
    }

    constructor(props) {
        super(props);
        this.guilist=[];
        var checked=[]
        props.projectConfigs.forEach((file) => {
            if(props.enabledConfigs.includes(file)) {
                checked.push(true)
            }
            else {
                checked.push(false)
            }
        })
        checked.push(true)
        this.state= {checked}

        this.domNode = document.createElement('div');
        this.domNode.classList.add(`icon-gear`);
        this.domNode.classList.add('inline-block')
    }

    componentDidMount() {
        this.consumeStatusBar()
    }

    consumeStatusBar() {
        if(this.tooltips) {
          this.tooltips.dispose()
        }
        if(this.tile) {
          this.tile.dispose()
        }
        this.domNode = document.createElement('div');
        this.domNode.id='domNode'
        this.domNode.classList.add('inline-block')
        this.buttonTrigger=false
        // Code from GitHub Pacakge
        console.log(this.props.statusBar)
        this.tile = this.props.statusBar.addLeftTile({item: this.domNode, priority: 100});
        this.tooltips = this.props.tooltips.add(this.domNode, {item: this.dummy, trigger: 'click', className:'status-bar-tooltip'})

    }

    reorder(from, to) {
      var projectNames = this.props.projectConfigs
      projectNames.splice(to, 0, projectNames.splice(from, 1)[0]);
      var temp = this.state.checked.slice(0,this.state.checked.length-1)
      temp.splice(to, 0, temp.splice(from, 1)[0]);
      temp.push(true)
      this.setState({checked: temp})
      this.buttonTrigger=true
      var pNames = projectNames.filter((_, index) => temp[index]);
      this.props.onReorder(projectNames, pNames)
    }

    onDrop(e) {
        var droppedOn = e.target.id
        var draggItem = e.dataTransfer.getData("text")
        // var projectNames = Array.from(this.props.projectConfigs.keys());
        var to = parseInt(droppedOn);
        var from = parseInt(draggItem);
        this.reorder(from, to)
    }

    onUpArrowClick(index) {
        return(()=> {
            if(index>0) {
                this.reorder(index,index-1)
            }
        })
    }

    onDownArrowClick(index) {
        return (() => {
            if(index<this.props.projectConfigs.length-1) {
                this.reorder(index,index+1)
            }
        })

    }

    onDrag(e) {
      e.dataTransfer.setData("text", e.target.id)
    }

    componentWillReceiveProps(nextProps) {
        this.setChecked(nextProps.projectConfigs, nextProps.enabledConfigs)
    }

    onCheck(index) {
        return (() => {
          this.buttonTrigger=true;
          var checked = this.state.checked
          checked[index] = !checked[index]
          this.props.onCheck(index, checked.slice(0,this.state.checked.length-1));
        })
    }

    render() {
        this.dummy = document.createElement('div');
        this.dummy.id='dummy'
        var guilist = this.props.projectConfigs.map((keyO, index) => {
            var split = keyO.split('/');
            var key= split[split.length - 3];
            return (<div
                id={index}
                key={key}
                className='am-pane'
                style={{marginLeft:'5%', display:'inlineBlock'}}
                draggable={true}
                onDragStart={this.onDrag.bind(this)}
                onDragOver={(e) => {e.preventDefault()}}
                onDrop={this.onDrop.bind(this)}>
                <div id={index} className='am-label'>
                  <div>
                    <input type='checkbox' id={`myCheck${index}`} checked={this.state.checked[index]} onChange={this.onCheck(index).bind(this)}/>
                    <a onClick={() => {atom.workspace.open(keyO)}}>{key} Local Settings</a>
                    <i className='icon-arrow-up' style={{marginLeft:'90%'}} onClick={this.onUpArrowClick(index).bind(this)}/>
                    <i className='icon-arrow-down' style={{marginLeft:'95%'}} onClick={this.onDownArrowClick(index).bind(this)}/>
                  </div>
                </div>
            </div>)
        })
        var element =
        <div
        className="am-status-bar"
        ref={(e) => {this.status_ref=e}}>
            {guilist}
            <div
                className='am-pane'
                style={{marginLeft:'5%'}}
                draggable={false}>
                <div className='am-label'>
                  <div>
                    <input type='checkbox' id='myCheckGlobal' checked={this.state.checked[this.state.checked.length - 1]} onClick={() => {return false}}/>
                    <span>Global</span>
                  </div>
                </div>
            </div>
        </div>
        ReactDom.render(element, this.dummy, (x) => {
          if(this.tooltips) {
            this.tooltips.dispose()
            this.tooltips = this.props.tooltips.add(this.domNode, {item: this.dummy, trigger: 'click', className:'status-bar'})
            if(this.buttonTrigger) {
              this.domNode.click();
              this.buttonTrigger=false;
            }
          }
        })
        return ReactDom.createPortal(
          this.props.children,
          this.domNode,
        );
    }
}
