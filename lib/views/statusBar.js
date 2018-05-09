'use babel';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

export default class StatusBar extends Component {

    static propTypes = {
        statusBar: PropTypes.object.isRequired,
        tooltips: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.guilist=[];
        this.tooltips = this.props.tooltips;
        this.domNode = document.createElement('div');
        this.domNode.classList.add(`icon-gear`);
        this.domNode.classList.add('inline-block')
    }

    componentDidMount() {
        this.consumeStatusBar()
    }

    consumeStatusBar() {
        // if(this.tooltips) {
        //   this.tooltips.dispose()
        // }
        if (this.tile) {
          this.tile.destroy()
        }
        this.domNode = document.createElement('div');
        this.domNode.classList.add('inline-block')
        // Code from GitHub Pacakge
        this.tile = this.props.statusBar.addLeftTile({item: this.domNode, priority: 100});
        this.props.tooltips.add(this.domNode, {item: this.dummy, trigger: 'click', className:'status-bar'})

    }

    onDrop(e) {
        var droppedOn = e.target.id
        var draggItem = e.dataTransfer.getData("text")
        console.log(droppedOn)
        console.log(draggItem)
        

    }

    onDrag(e) {
      e.dataTransfer.setData("text", e.target.id)
    }

    shouldComponentUpdate() {
      return true;
    }

    render() {
        this.dummy = document.createElement('div');

        function formatProjectSettings(projectSettings) {
          // console.log(projectSettings)
            var str = ''
            Array.from(projectSettings.keys()).forEach((key) => {
                str = str + key + JSON.stringify(projectSettings.get(key), null, 2);
            })
            return str.replace(/\{|\}/g, '');
            // return str

        }
        let index=0;

        var guilist = Array.from(this.props.projectConfigs.keys()).map((keyO, index) => {
          // const guilist = abc.map(key => {
            var split = keyO.split('/');
            var key= split[split.length - 3];
            return (<div
                id={index}
                key={key}
                className='am-pane'
                style={{marginLeft:'5%'}}
                draggable={true}
                onDragStart={this.onDrag.bind(this)}
                onDragOver={(e) => {e.preventDefault()}}
                onDrop={this.onDrop.bind(this)}>
                <div id={index} className='am-label'><a onClick={() => {atom.workspace.open(keyO)}}>{key} Local Settings</a></div>
                <div id={index} className='am-values'><pre id='json'><div id={index++}>{formatProjectSettings(this.props.projectConfigs.get(keyO))}</div></pre></div>
            </div>)
        })

        // <div id={key} className='am-values'>{formatProjectSettings(this.props.projectConfigs.get(keyO))}</div>


        var element =
        <div className="am-status-bar" ref={(e) => {this.status_ref=e}}>
            {guilist}
            <div
                className='am-pane'
                style={{marginLeft:'5%'}}
                draggable={false}>
                <div className='am-label'>Global</div>
            </div>
        </div>



        ReactDom.render(element, this.dummy)
        return ReactDom.createPortal(
          this.props.children,
          this.domNode,
        );
    }
}
