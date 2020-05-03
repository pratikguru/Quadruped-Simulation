import React, { Component } from "react";
import styled from "styled-components";
import {
  Container,
  ControlSet,
  Slider,
  SliderControl,
  SliderBoxBody,
  SliderBoxHeader,
  Label,
  IterButton,
  ChoiceBox,
  ControlSlider,
  ChoiceSwitch
} from "./interfaceStyles.js";

class SliderClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [props.stateLabel]: 10,
      choice: false
    };
  }
  handleSliderChange = (e, label) => {
    this.setState({
      [label]: e.target.value
    });
    this.props.handleSliderChange(this.state[label], label);
  };

  handleIncrement = label => {
    let value = this.state[label];
    value++;
    if (value > this.props.controls.max) {
      return;
    }
    this.setState({
      [label]: value
    });
    this.props.handleIncrement(this.state[label], label);
  };

  handleDecrement = label => {
    let value = this.state[label];
    value--;
    if (value < this.props.controls.min) {
      return;
    }
    this.setState({
      [label]: value
    });
    this.props.handleDecrement(this.state[label], label);
  };

  render() {
    return (
      <ControlSet>
        <SliderControl>
          <SliderBoxHeader> {this.props.title} </SliderBoxHeader>
          {this.props.controls.map((value, index) => (
            <SliderBoxBody>
              <Label> {value.label} </Label>
              <IterButton
                onClick={() => {
                  this.handleDecrement(value.stateLabel);
                }}
              >
                {" "}
                <span> {"<"} </span>{" "}
                <span style={{ fontSize: "10px" }}>
                  {" "}
                  {this.state[value["stateLabel"]]}{" "}
                </span>{" "}
              </IterButton>
              <Slider
                type="range"
                onChange={e => this.handleSliderChange(e, value.stateLabel)}
                value={this.state[value["stateLabel"]]}
                min={value["min"]}
                max={value["max"]}
                step={"-1"}
              ></Slider>
              <IterButton
                onClick={() => {
                  this.handleIncrement(value.stateLabel);
                }}
              >
                <span> {">"} </span>{" "}
                <span style={{ fontSize: "10px" }}>
                  {" "}
                  {this.state[value["stateLabel"]]}{" "}
                </span>{" "}
              </IterButton>
            </SliderBoxBody>
          ))}
        </SliderControl>
      </ControlSet>
    );
  }
}

export default class Interface extends Component {
  state = {
    choice: true
  };

  handleSliderChange = (e, label) => {
    this.props.handleSliderChange(e, label);
  };

  handleIncrement = (value, label) => {
    console.log(value, label);
  };

  handleDecrement = (value, label) => {
    console.log(value, label);
  };

  handleChoice = () => {
    this.setState(
      {
        choice: !this.state.choice
      },
      () => {
        this.props.toggleChoice("choice", this.state.choice);
      }
    );
  };

  render() {
    const FKList = [
      [
        {
          label: "T1",
          stateLabel: "theta_1_leg_1",
          min: 0,
          max: 180
        },
        {
          label: "T2",
          stateLabel: "theta_2_leg_1",
          min: 0,
          max: 180
        },
        {
          label: "T3",
          stateLabel: "theta_3_leg_1",
          min: 0,
          max: 180
        }
      ],
      [
        {
          label: "T1",
          stateLabel: "theta_1_leg_2",
          min: 0,
          max: 180
        },
        {
          label: "T1",
          stateLabel: "theta_2_leg_2",
          min: 0,
          max: 180
        },
        {
          label: "T1",
          stateLabel: "theta_3_leg_2",
          min: 0,
          max: 180
        }
      ],
      [
        {
          label: "T1",
          stateLabel: "theta_1_leg_3",
          min: 0,
          max: 180
        },
        {
          label: "T1",
          stateLabel: "theta_2_leg_3",
          min: 0,
          max: 180
        },
        {
          label: "T1",
          stateLabel: "theta_3_leg_3",
          min: 0,
          max: 180
        }
      ],
      [
        {
          label: "T1",
          stateLabel: "theta_1_leg_4",
          min: 0,
          max: 180
        },
        {
          label: "T1",
          stateLabel: "theta_2_leg_4",
          min: 0,
          max: 180
        },
        {
          label: "T1",
          stateLabel: "theta_3_leg_4",
          min: 0,
          max: 180
        }
      ]
    ];
    const controlList = [
      [
        {
          label: "x",
          stateLabel: "xValueLeg_1",
          min: -200,
          max: 200
        },
        {
          label: "y",
          stateLabel: "yValueLeg_1",
          min: -200,
          max: 200
        },
        {
          label: "z",
          stateLabel: "zValueLeg_1",
          min: -200,
          max: 200
        }
      ],
      [
        {
          label: "x",
          stateLabel: "xValueLeg_2",
          min: -200,
          max: 200
        },
        {
          label: "y",
          stateLabel: "yValueLeg_2",
          min: -200,
          max: 200
        },
        {
          label: "z",
          stateLabel: "zValueLeg_2",
          min: -200,
          max: 200
        }
      ],
      [
        {
          label: "x",
          stateLabel: "xValueLeg_3",
          min: -200,
          max: 200
        },
        {
          label: "y",
          stateLabel: "yValueLeg_3",
          min: -200,
          max: 200
        },
        {
          label: "z",
          stateLabel: "zValueLeg_3",
          min: -200,
          max: 200
        }
      ],
      [
        {
          label: "x",
          stateLabel: "xValueLeg_4",
          min: -200,
          max: 200
        },
        {
          label: "y",
          stateLabel: "yValueLeg_4",
          min: -200,
          max: 200
        },
        {
          label: "z",
          stateLabel: "zValueLeg_4",
          min: -200,
          max: 200
        }
      ]
    ];

    const BodyControls = [
      {
        label: "Radius",
        stateLabel: "bodyRadius",
        min: 10,
        max: 100
      }
    ];

    const FrameControl = [
      {
        label: "Frame",
        stateLabel: "frameCount",
        min: 0,
        max: 100
      }
    ];

    return (
      <Container>
        <ChoiceBox>
          <ControlSlider>
            <ChoiceSwitch
              onClick={() => {
                this.setState(this.handleChoice);
              }}
            >
              {this.state.choice ? "FK" : "IK"}
            </ChoiceSwitch>
          </ControlSlider>
        </ChoiceBox>
        {this.state.choice ? (
          <div>
            <SliderClass
              title={"Forwar Kinematics Leg 1"}
              controls={FKList[0]}
              handleSliderChange={this.handleSliderChange}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            ></SliderClass>
            <SliderClass
              title={"Forward Kinematics Leg 2"}
              controls={FKList[1]}
              handleSliderChange={this.handleSliderChange}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            ></SliderClass>
            <SliderClass
              title={"Forward Kinematics Leg 3"}
              controls={FKList[2]}
              handleSliderChange={this.handleSliderChange}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            ></SliderClass>
            <SliderClass
              title={"Forward Kinematics Leg 4"}
              controls={FKList[3]}
              handleSliderChange={this.handleSliderChange}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            ></SliderClass>
          </div>
        ) : (
          <div>
            <SliderClass
              title={"Inverse Kinematics Leg 1"}
              controls={controlList[0]}
              handleSliderChange={this.handleSliderChange}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            ></SliderClass>

            <SliderClass
              title={"Inverse Kinematics Leg 2"}
              controls={controlList[1]}
              handleSliderChange={this.handleSliderChange}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            ></SliderClass>

            <SliderClass
              title={"Inverse Kinematics Leg 3"}
              controls={controlList[2]}
              handleSliderChange={this.handleSliderChange}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            ></SliderClass>
            <SliderClass
              title={"Inverse Kinematics Leg 4"}
              controls={controlList[3]}
              handleSliderChange={this.handleSliderChange}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            ></SliderClass>
          </div>
        )}

        <SliderClass
          title={"Body"}
          controls={BodyControls}
          handleSliderChange={this.handleSliderChange}
          handleIncrement={this.handleIncrement}
          handleDecrement={this.handleDecrement}
        ></SliderClass>
        <SliderClass
          title={"Frame"}
          controls={FrameControl}
          handleSliderChange={this.handleSliderChange}
          handleIncrement={this.handleIncrement}
          handleDecrement={this.handleDecrement}
        ></SliderClass>
      </Container>
    );
  }
}
