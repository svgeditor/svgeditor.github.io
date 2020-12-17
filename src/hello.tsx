import * as React from 'react';

export interface IHelloProps {}

export interface IHelloState {}

export default class Hello extends React.Component<IHelloProps, IHelloState> {
  constructor(props: IHelloProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div>Hello world!</div>;
  }
}
