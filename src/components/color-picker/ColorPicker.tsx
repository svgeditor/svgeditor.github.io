import './color-picker.scss';
import * as React from 'react';
import { SketchPicker } from 'react-color';
import { Color } from '../../models/Color';

export interface IColorPickerProps {
  color: Color;
  onChange: (color: Color) => void;
}

export interface IColorPickerState {
  displayColorPicker: boolean;
  color: Color;
}

export default class ColorPicker extends React.Component<IColorPickerProps, IColorPickerState> {
  constructor(props: IColorPickerProps) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: this.props.color,
    };
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (newColor) => {
    const color = new Color(newColor.rgb.r, newColor.rgb.g, newColor.rgb.b, newColor.rgb.a);
    this.setState({ color });
    this.props.onChange(color);
  };

  render() {
    return (
      <div className='color-picker-container'>
        <div className='color-wrapper' onClick={this.handleClick}>
          <div className='color' style={{ background: this.state.color.getRgba() }}></div>
        </div>
        {this.state.displayColorPicker ? (
          <div className='popover'>
            <div className='cover' onClick={this.handleClose} />
            <SketchPicker color={this.state.color} onChange={this.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}
