import React, { Component } from "react";
import styled from "styled-components";
import Interface from "../Interface/interface";
import PlotArea from "../PlotArea/mainPlot";
import ControlPanel, { Checkbox, Range, Button } from "react-control-panel";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #37364c;
  justify-content: center;
  align-items: center;
  flex-direction: rows;
`;

const ControlBox = styled.div`
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
`;

const CustomRange = styled.input`
  height: 20px;
  width: 200px;
`;

const AreaContainers = styled.div`
  width: 98%;
  height: 98%;
  display: flex;

  margin: 5px;
  border-radius: 5px;
`;
const initialState = {
  theta_1_leg_1: 135,
  theta_2_leg_1: 90,
  theta_3_leg_1: 0,

  theta_1_leg_2: 135,
  theta_2_leg_2: 90,
  theta_3_leg_2: 0,

  theta_1_leg_3: 135,
  theta_2_leg_3: 90,
  theta_3_leg_3: 0,

  theta_1_leg_4: 45,
  theta_2_leg_4: 90,
  theta_3_leg_4: 0,

  xValueLeg_1: -130,
  xValueLeg_2: -130,
  xValueLeg_3: 130,
  xValueLeg_4: 130,

  yValueLeg_1: -120,
  yValueLeg_2: 120,
  yValueLeg_3: -120,
  yValueLeg_4: 120,

  zValueLeg_1: 0,
  zValueLeg_2: 0,
  zValueLeg_3: 0,
  zValueLeg_4: 0,

  FK: true,
  leg_1: true,
  leg_2: true,
  leg_3: true,
  leg_4: true,
  showMesh: true,

  bodyRadius: 50,

  coxa: 60,
  tibia: 120,
  femur: 110,

  rotX: 0,
  rotY: 0,
  rotZ: 0,
};
export default class MainController extends Component {
  state = {
    ...initialState,
  };

  handleSliderChange = (e, label) => {
    this.setState({
      [label]: e,
    });
  };

  handleToggleChange = (e, state) => {
    this.setState(
      {
        [e]: state,
      },
      () => {
        console.log(this.state[e]);
      }
    );
  };

  handleRotations = () => {
    let theta_1 = this.state.rotX;
    let theta_2 = this.state.rotY;
    let theta_3 = this.state.rotZ;

    let x,
      y,
      z = 0;
  };

  render() {
    return (
      <Container>
        <AreaContainers>
          <PlotArea
            radius={this.state.bodyRadius}
            choice={this.state.FK}
            showMesh={this.state.showMesh}
            frameCount={this.state.frameCount}
            lengths={{
              coxa: this.state.coxa,
              tibia: this.state.tibia,
              femur: this.state.femur,
            }}
            rotations={{
              rotX: this.state.rotX,
              rotY: this.state.rotY,
              rotZ: this.state.rotZ,
            }}
            fk={[
              [
                this.state.theta_1_leg_1,
                this.state.theta_2_leg_1,
                this.state.theta_3_leg_1,
              ],
              [
                this.state.theta_1_leg_2,
                this.state.theta_2_leg_2,
                this.state.theta_3_leg_2,
              ],
              [
                this.state.theta_1_leg_3,
                this.state.theta_2_leg_3,
                this.state.theta_3_leg_3,
              ],
              [
                this.state.theta_1_leg_4,
                this.state.theta_2_leg_4,
                this.state.theta_3_leg_4,
              ],
            ]}
            ik={[
              [
                this.state.xValueLeg_1,
                this.state.yValueLeg_1,
                this.state.zValueLeg_1,
              ],
              [
                this.state.xValueLeg_2,
                this.state.yValueLeg_2,
                this.state.zValueLeg_2,
              ],
              [
                this.state.xValueLeg_3,
                this.state.yValueLeg_3,
                this.state.zValueLeg_3,
              ],
              [
                this.state.xValueLeg_4,
                this.state.yValueLeg_4,
                this.state.zValueLeg_4,
              ],
            ]}
          />
        </AreaContainers>

        <ControlPanel
          position="top-right"
          draggable={true}
          theme="dark"
          title="Control Panel"
          initialState={initialState}
          onChange={(key, value) =>
            this.setState({
              [key]: value,
            })
          }
          width={300}
          style={{ marginRight: 30 }}
        >
          <Checkbox label="FK" />
          <Checkbox label="showMesh" />
          <Range label="bodyRadius" min={10} max={200} />
          <Checkbox label="leg_1" />
          <Button
            label="Reset"
            action={() => this.setState({ ...initialState })}
          />
          {!this.state.FK ? (
            <div>
              <Range label="xValueLeg_1" min={-200} max={200} />
              <Range label="yValueLeg_1" min={-200} max={200} />
              <Range label="zValueLeg_1" min={-200} max={200} />
              <Checkbox label="leg_2" />
              <Range label="xValueLeg_2" min={-200} max={200} />
              <Range label="yValueLeg_2" min={-200} max={200} />
              <Range label="zValueLeg_2" min={-200} max={200} />
              <Checkbox label="leg_3" />
              <Range label="xValueLeg_3" min={-200} max={200} />
              <Range label="yValueLeg_3" min={-200} max={200} />
              <Range label="zValueLeg_3" min={-200} max={200} />
              <Checkbox label="leg_4" />
              <Range label="xValueLeg_4" min={-200} max={200} />
              <Range label="yValueLeg_4" min={-200} max={200} />
              <Range label="zValueLeg_4" min={-200} max={200} />
            </div>
          ) : (
            <div>
              <Range label="theta_1_leg_1" min={-200} max={200} />
              <Range label="theta_2_leg_1" min={-200} max={200} />
              <Range label="theta_3_leg_1" min={-200} max={200} />
              <Checkbox label="leg_2" />
              <Range label="theta_1_leg_2" min={-200} max={200} />
              <Range label="theta_2_leg_2" min={-200} max={200} />
              <Range label="theta_3_leg_2" min={-200} max={200} />
              <Checkbox label="leg_3" />
              <Range label="theta_1_leg_3" min={-200} max={200} />
              <Range label="theta_2_leg_3" min={-200} max={200} />
              <Range label="theta_3_leg_3" min={-200} max={200} />
              <Checkbox label="leg_4" />
              <Range label="theta_1_leg_4" min={-200} max={200} />
              <Range label="theta_2_leg_4" min={-200} max={200} />
              <Range label="theta_3_leg_4" min={-200} max={200} />
            </div>
          )}
          <Range label="coxa" min={10} max={200} />
          <Range label="tibia" min={10} max={200} />
          <Range label="femur" min={10} max={200} />
        </ControlPanel>
        <ControlPanel
          position="top-left"
          draggable={true}
          theme="dark"
          title="Body Control"
          initialState={initialState}
          onChange={(key, value) =>
            this.setState({
              [key]: value,
            })
          }
          width={300}
          style={{ marginRight: 30 }}
        >
          <Button
            label="Reset"
            action={() => this.setState({ ...initialState })}
          />
          <Range label="rotX" min={-200} max={200} />
          <Range label="rotY" min={-200} max={200} />
          <Range label="rotZ" min={-200} max={200} />
        </ControlPanel>
      </Container>
    );
  }
}
