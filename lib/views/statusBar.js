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

    render() {
        this.dummy = document.createElement('div');
        var abc = [0,1]

        const guilist = abc.map(el => {
            return (<div
                className='am-pane'
                style={{marginLeft:'5%'}}
                draggable={true}>
                <div className='am-label'>Project</div>
                <div className='am-values'>{el}</div>
            </div>)
        })

        console.log(guilist)

        const element =
        <div className="am-status-bar" d>
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
