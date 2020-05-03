import React, { Component } from "react";
import styled from "styled-components";
import Plot from "react-plotly.js";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

class Joint {
  constructor(link_1, link_2, link_3, theta_1, theta_2, theta_3, name) {
    this.joint = {
      theta_1: theta_1,
      theta_2: theta_2,
      theta_3: theta_3,

      link_1: link_1,
      link_2: link_2,
      link_3: link_3,
      name: name,
    };
  }

  rad2deg(value) {
    var pi = Math.PI;
    return value * (180 / pi);
  }

  deg2rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  printJoint() {
    console.log("Link 1: " + this.theta_1);
    console.log("link 2: " + this.theta_2);
    console.log("link 3: " + this.theta_3);
  }
}

class Robot {
  constructor() {
    this.bodyRadius = 0;
  }

  getRobotBody(rads) {
    //[ -50, 50, 50, -50, -50 ], [ -50, -50, 50, 50, -50 ], [0, 0, 0, 0, 0]
    let x = [-rads, rads, rads, -rads, -rads];
    let y = [-rads, -rads, rads, rads, -rads];
    let z = [0, 0, 0, 0, 0];
    return {
      x: x,
      y: y,
      z: z,
    };
  }

  _filterEndPoint(point_set) {
    return [
      [point_set[0][0][3], point_set[0][1][3], point_set[0][2][3]],
      [point_set[1][0][3], point_set[1][1][3], point_set[1][2][3]],
      [point_set[2][0][3], point_set[2][1][3], point_set[2][2][3]],
    ];
  }

  _multiplyMatrices(firstArray, secondArray) {
    let resultingArray = [];
    let n = 4;
    for (let i = 0; i < n; i++) {
      resultingArray.push([]);
      for (let j = 0; j < n; j++) {
        resultingArray[i][j] = 0;
        for (let k = 0; k < n; k++) {
          resultingArray[i][j] += firstArray[i][k] * secondArray[k][j];
        }
      }
    }
    return resultingArray;
  }

  getFK(joint) {
    let T0_1 = [
      [Math.cos(joint.theta_1), -Math.sin(joint.theta_1), 0, 0],
      [Math.sin(joint.theta_1), Math.cos(joint.theta_1), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    let T0_2 = [
      [Math.cos(joint.theta_2), -Math.sin(joint.theta_2), 0, joint.link_1],
      [0, 0, -1, 0],
      [Math.sin(joint.theta_2), Math.cos(joint.theta_2), 0, 0],
      [0, 0, 0, 1],
    ];

    let T0_3 = [
      [Math.cos(joint.theta_3), -Math.sin(joint.theta_3), 0, joint.link_2],
      [Math.sin(joint.theta_3), Math.cos(joint.theta_3), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    let T0_4 = [
      [1, 0, 0, joint.link_3],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    let point_set_1 = this._multiplyMatrices(T0_1, T0_2);
    let point_set_2 = this._multiplyMatrices(point_set_1, T0_3);
    let point_set_3 = this._multiplyMatrices(point_set_2, T0_4);

    return this._filterEndPoint([point_set_1, point_set_2, point_set_3]);
  }

  getIK(x, y, z, joint) {
    let theta_1 = Math.atan2(y, x);
    let A = z;
    let B = Math.cos(theta_1) * x + y * Math.sin(theta_1) - joint.link_1;
    let C =
      (Math.pow(A, 2) +
        Math.pow(B, 2) -
        Math.pow(joint.link_3, 2) -
        Math.pow(joint.link_2, 2)) /
      (2 * joint.link_3 * joint.link_2);
    let theta_3 = Math.atan2(Math.sqrt(1 - Math.pow(C, 2)), C);
    let D = Math.cos(theta_3) * joint.link_3 + joint.link_2;
    let E = Math.sin(theta_3) * joint.link_3;

    let numerator = (A * D - B * E) / (Math.pow(E, 2) + Math.pow(D, 2));
    let denominator = 1 - Math.pow(numerator, 2);

    let theta_2 = Math.atan2(numerator, Math.sqrt(denominator));

    joint.theta_1 = joint.rad2deg(theta_1);
    joint.theta_2 = joint.rad2deg(theta_2);
    joint.theta_3 = joint.rad2deg(theta_3);

    return joint;
  }

  getFrame(frameCount, props) {}
}

export default class PlotArea extends Component {
  constructor(props) {
    super();
    this.bot = new Robot(props);
    this.joint_1 = new Joint(120, 110, 120, 0, 0, 0);
    this.joint_2 = new Joint(120, 110, 120, 0, 0, 0);
    this.joint_3 = new Joint(120, 110, 120, 0, 0, 0);
    this.joint_4 = new Joint(120, 110, 120, 0, 0, 0);

    this.endEffectorPoints = [[], [], [], []];
    if (props.choice) {
      this.leg_1 = this.bot.getFK(
        this.prepareJointFK(1, this.joint_1, props.fk, props.lengths)
      );
      this.leg_2 = this.bot.getFK(
        this.prepareJointFK(2, this.joint_2, props.fk, props.lengths)
      );
      this.leg_3 = this.bot.getFK(
        this.prepareJointFK(3, this.joint_3, props.fk, props.lengths)
      );
      this.leg_4 = this.bot.getFK(
        this.prepareJointFK(4, this.joint_4, props.fk, props.lengths)
      );
    } else {
      this.leg_1 = this.bot.getFK(
        this.preapreJointIK(
          1,
          this.joint_1,
          this.bot.getIK(
            props.ik[0][0],
            props.ik[0][1],
            props.ik[0][2] || props.frameCount,
            this.joint_1
          )
        )
      );

      this.leg_2 = this.bot.getFK(
        this.preapreJointIK(
          2,
          this.joint_2,
          this.bot.getIK(
            props.ik[1][0],
            props.ik[1][1],
            props.ik[1][2],
            this.joint_2
          )
        )
      );

      this.leg_3 = this.bot.getFK(
        this.preapreJointIK(
          3,
          this.joint_3,
          this.bot.getIK(
            props.ik[2][0],
            props.ik[2][1],
            props.ik[2][2],
            this.joint_3
          )
        )
      );

      this.leg_4 = this.bot.getFK(
        this.preapreJointIK(
          4,
          this.joint_4,
          this.bot.getIK(
            props.ik[3][0],
            props.ik[3][1],
            props.ik[3][2],
            this.joint_4
          )
        )
      );
    }

    this.state = {
      bodyDimension: this.bot.getRobotBody(props.radius),
      endEffectorPoints: [],
    };
  }

  componentDidMount() {
    if (this.props.choice === "IK") {
      for (let i = 0; i < 100; i++) {
        this.leg_1 = this.bot.getFK(
          this.preapreJointIK(
            1,
            this.joint_1,
            this.bot.getIK(
              this.props.ik[0][0],
              this.props.ik[0][1],
              i,
              this.joint_1
            ),
            this.props.lengths
          )
        );
      }
    }
  }

  preapreJointIK = (leg, joint, prop, length) => {
    switch (leg) {
      case 1: {
        joint.theta_1 = -joint.deg2rad(prop.theta_1);
        joint.theta_2 = -joint.deg2rad(prop.theta_2);
        joint.theta_3 = -joint.deg2rad(prop.theta_3);
        joint.link_1 = length.coxa;
        joint.link_2 = length.tibia;
        joint.link_3 = length.femur;
        break;
      }

      case 2: {
        joint.theta_1 = -joint.deg2rad(prop.theta_1);
        joint.theta_2 = -joint.deg2rad(prop.theta_2);
        joint.theta_3 = -joint.deg2rad(prop.theta_3);
        joint.link_1 = length.coxa;
        joint.link_2 = length.tibia;
        joint.link_3 = length.femur;
        break;
      }

      case 3: {
        joint.theta_1 = -joint.deg2rad(prop.theta_1);
        joint.theta_2 = -joint.deg2rad(prop.theta_2);
        joint.theta_3 = -joint.deg2rad(prop.theta_3);
        joint.link_1 = length.coxa;
        joint.link_2 = length.tibia;
        joint.link_3 = length.femur;
        break;
      }

      case 4: {
        joint.theta_1 = -joint.deg2rad(prop.theta_1);
        joint.theta_2 = -joint.deg2rad(prop.theta_2);
        joint.theta_3 = -joint.deg2rad(prop.theta_3);
        joint.link_1 = length.coxa;
        joint.link_2 = length.tibia;
        joint.link_3 = length.femur;
        break;
      }

      default: {
      }
    }
    return joint;
  };

  deg2rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  prepareJointFK = (leg, joint, props, length) => {
    switch (leg) {
      case 1: {
        joint.theta_1 = -joint.deg2rad(props[0][0]);
        joint.theta_2 = -joint.deg2rad(180 - props[0][1] - 90);
        joint.theta_3 = -joint.deg2rad(180 - props[0][2] - 90);
        joint.link_1 = length.coxa;
        joint.link_2 = length.tibia;
        joint.link_3 = length.femur;
        break;
      }

      case 2: {
        joint.theta_1 = -joint.deg2rad(180 - props[1][0]);
        joint.theta_2 = -joint.deg2rad(180 - props[1][1] - 90);
        joint.theta_3 = -joint.deg2rad(180 - props[1][2] - 90);
        joint.link_1 = length.coxa;
        joint.link_2 = length.tibia;
        joint.link_3 = length.femur;
        break;
      }

      case 3: {
        joint.theta_1 = -joint.deg2rad(props[2][0] - 180);
        joint.theta_2 = -joint.deg2rad(180 - props[2][1] - 90);
        joint.theta_3 = -joint.deg2rad(180 - props[2][2] - 90);
        joint.link_1 = length.coxa;
        joint.link_2 = length.tibia;
        joint.link_3 = length.femur;
        break;
      }

      case 4: {
        joint.theta_1 = -joint.deg2rad(props[3][0] - 180);
        joint.theta_2 = -joint.deg2rad(180 - props[3][1] - 90);
        joint.theta_3 = -joint.deg2rad(180 - props[3][2] - 90);
        joint.link_1 = length.coxa;
        joint.link_2 = length.tibia;
        joint.link_3 = length.femur;
        break;
      }
    }
    return joint;
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      bodyDimension: this.bot.getRobotBody(nextProps.radius),
    });

    if (nextProps.choice) {
      this.leg_1 = this.bot.getFK(
        this.prepareJointFK(1, this.joint_1, nextProps.fk, nextProps.lengths)
      );
      this.leg_2 = this.bot.getFK(
        this.prepareJointFK(2, this.joint_2, nextProps.fk, nextProps.lengths)
      );
      this.leg_3 = this.bot.getFK(
        this.prepareJointFK(3, this.joint_3, nextProps.fk, nextProps.lengths)
      );
      this.leg_4 = this.bot.getFK(
        this.prepareJointFK(4, this.joint_4, nextProps.fk, nextProps.lengths)
      );

      this.endEffectorPoints = [
        [this.leg_1[2][0], -this.leg_1[2][1], -this.leg_1[2][2]],
        [this.leg_2[2][0], -this.leg_2[2][1], -this.leg_2[2][2]],
        [this.leg_3[2][0], -this.leg_3[2][1], -this.leg_3[2][2]],
        [this.leg_4[2][0], -this.leg_4[2][1], -this.leg_4[2][2]],
      ];
    } else {
      this.endEffectorPoints = [
        [
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[0][0],
            y: nextProps.ik[0][1],
            z: nextProps.ik[0][2],
          }).x,
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[0][0],
            y: nextProps.ik[0][1],
            z: nextProps.ik[0][2],
          }).y,
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[0][0],
            y: nextProps.ik[0][1],
            z: nextProps.ik[0][2],
          }).z,
        ],
        [
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[1][0],
            y: nextProps.ik[1][1],
            z: nextProps.ik[1][2],
          }).x,
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[1][0],
            y: nextProps.ik[1][1],
            z: nextProps.ik[1][2],
          }).y,
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[1][0],
            y: nextProps.ik[1][1],
            z: nextProps.ik[1][2],
          }).z,
        ],
        [
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[2][0],
            y: nextProps.ik[2][1],
            z: nextProps.ik[2][2],
          }).x,
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[2][0],
            y: nextProps.ik[2][1],
            z: nextProps.ik[2][2],
          }).y,
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[2][0],
            y: nextProps.ik[2][1],
            z: nextProps.ik[2][2],
          }).z,
        ],
        [
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[3][0],
            y: nextProps.ik[3][1],
            z: nextProps.ik[3][2],
          }).x,
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[3][0],
            y: nextProps.ik[3][1],
            z: nextProps.ik[3][2],
          }).y,
          this.handleRotation(nextProps.rotations, {
            x: nextProps.ik[3][0],
            y: nextProps.ik[3][1],
            z: nextProps.ik[3][2],
          }).z,
        ],
      ];

      this.leg_1 = this.bot.getFK(
        this.preapreJointIK(
          1,
          this.joint_1,
          this.bot.getIK(
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[0][0],
              y: nextProps.ik[0][1],
              z: nextProps.ik[0][2],
            }).x,
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[0][0],
              y: nextProps.ik[0][1],
              z: nextProps.ik[0][2],
            }).y,
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[0][0],
              y: nextProps.ik[0][1],
              z: nextProps.ik[0][2],
            }).z,
            this.joint_1
          ),
          nextProps.lengths
        )
      );

      this.leg_2 = this.bot.getFK(
        this.preapreJointIK(
          2,
          this.joint_2,
          this.bot.getIK(
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[1][0],
              y: nextProps.ik[1][1],
              z: nextProps.ik[1][2],
            }).x,
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[1][0],
              y: nextProps.ik[1][1],
              z: nextProps.ik[1][2],
            }).y,
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[1][0],
              y: nextProps.ik[1][1],
              z: nextProps.ik[1][2],
            }).z,
            this.joint_2
          ),
          nextProps.lengths
        )
      );

      this.leg_3 = this.bot.getFK(
        this.preapreJointIK(
          2,
          this.joint_2,
          this.bot.getIK(
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[2][0],
              y: nextProps.ik[2][1],
              z: nextProps.ik[2][2],
            }).x,
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[2][0],
              y: nextProps.ik[2][1],
              z: nextProps.ik[2][2],
            }).y,
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[2][0],
              y: nextProps.ik[2][1],
              z: nextProps.ik[2][2],
            }).z,
            this.joint_2
          ),
          nextProps.lengths
        )
      );

      this.leg_4 = this.bot.getFK(
        this.preapreJointIK(
          4,
          this.joint_4,
          this.bot.getIK(
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[3][0],
              y: nextProps.ik[3][1],
              z: nextProps.ik[3][2],
            }).x,
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[3][0],
              y: nextProps.ik[3][1],
              z: nextProps.ik[3][2],
            }).y,
            this.handleRotation(nextProps.rotations, {
              x: nextProps.ik[3][0],
              y: nextProps.ik[3][1],
              z: nextProps.ik[3][2],
            }).z,
            this.joint_4
          ),
          nextProps.lengths
        )
      );
    }
  }

  handleRotation = (rotation, currentPoint) => {
    let theta_1 = this.deg2rad(rotation.rotX);
    let theta_2 = this.deg2rad(rotation.rotY);
    let theta_3 = this.deg2rad(rotation.rotZ);

    let x = currentPoint.x;
    let y = currentPoint.y;
    let z = currentPoint.z;

    let rotationMatrix = [
      y *
        (Math.cos(theta_1) * Math.sin(theta_3) +
          Math.cos(theta_3) * Math.sin(theta_1) * Math.sin(theta_2)) +
        z *
          (Math.sin(theta_1) * Math.sin(theta_3) -
            Math.cos(theta_1) * Math.cos(theta_3) * Math.sin(theta_2)) +
        x * Math.cos(theta_2) * Math.cos(theta_3),
      y *
        (Math.cos(theta_1) * Math.cos(theta_3) -
          Math.sin(theta_1) * Math.sin(theta_2) * Math.sin(theta_3)) +
        z *
          (Math.cos(theta_3) * Math.sin(theta_1) +
            Math.cos(theta_1) * Math.sin(theta_2) * Math.sin(theta_3)) -
        x * Math.cos(theta_2) * Math.sin(theta_3),
      x * Math.sin(theta_2) +
        z * Math.cos(theta_1) * Math.cos(theta_2) -
        y * Math.cos(theta_2) * Math.sin(theta_1),
    ];

    return { x: rotationMatrix[0], y: rotationMatrix[1], z: rotationMatrix[2] };
  };

  getGeneratedMesh = () => {
    let mesh = {
      x: [
        this.endEffectorPoints[0][0],
        this.endEffectorPoints[1][0],
        this.endEffectorPoints[2][0],
        this.endEffectorPoints[3][0],
      ],
      y: [
        -this.endEffectorPoints[0][1],
        -this.endEffectorPoints[1][1],
        -this.endEffectorPoints[2][1],
        -this.endEffectorPoints[3][1],
      ],
      z: [
        -this.endEffectorPoints[0][2],
        -this.endEffectorPoints[1][2],
        -this.endEffectorPoints[2][2],
        -this.endEffectorPoints[3][2],
      ],
    };
    return mesh;
  };

  render() {
    return (
      <Container>
        <Plot
          data={[
            {
              x: this.state.bodyDimension.x,
              y: this.state.bodyDimension.y,
              z: this.state.bodyDimension.z,
              type: "mesh3d",
              mode: "lines+markers",
              line: {
                width: 6,
                colorscale: "Viridis",
              },
              marker: {
                size: 3.5,
                colorscale: "Greens",
                cmin: -20,
                cmax: 50,
              },
            },
            {
              // LEG 1
              x: [0, this.leg_1[0][0], this.leg_1[1][0], this.leg_1[2][0]],
              y: [0, this.leg_1[0][1], this.leg_1[1][1], this.leg_1[2][1]],
              z: [0, this.leg_1[0][2], this.leg_1[1][2], this.leg_1[2][2]],
              type: "scatter3d",
              mode: "lines+markers",
              line: {
                width: 6,
                colorscale: "Viridis",
              },
              marker: {
                size: 3.5,
                colorscale: "Reds",
                cmin: -20,
                cmax: 50,
              },
            },
            {
              // LEG 2
              x: [0, this.leg_2[0][0], this.leg_2[1][0], this.leg_2[2][0]],
              y: [0, this.leg_2[0][1], this.leg_2[1][1], this.leg_2[2][1]],
              z: [0, this.leg_2[0][2], this.leg_2[1][2], this.leg_2[2][2]],
              type: "scatter3d",
              mode: "lines+markers",
              line: {
                width: 6,
                colorscale: "Viridis",
              },
              marker: {
                size: 3.5,
                colorscale: "Greens",
                cmin: -20,
                cmax: 50,
              },
            },
            {
              // LEG 3
              x: [0, this.leg_3[0][0], this.leg_3[1][0], this.leg_3[2][0]],
              y: [0, this.leg_3[0][1], this.leg_3[1][1], this.leg_3[2][1]],
              z: [0, this.leg_3[0][2], this.leg_3[1][2], this.leg_3[2][2]],
              type: "scatter3d",
              mode: "lines+markers",
              line: {
                width: 6,
                colorscale: "Viridis",
              },
              marker: {
                size: 3.5,
                colorscale: "Greens",
                cmin: -20,
                cmax: 50,
              },
            },
            {
              // LEG 4
              x: [0, this.leg_4[0][0], this.leg_4[1][0], this.leg_4[2][0]],
              y: [0, this.leg_4[0][1], this.leg_4[1][1], this.leg_4[2][1]],
              z: [0, this.leg_4[0][2], this.leg_4[1][2], this.leg_4[2][2]],
              type: "scatter3d",
              mode: "lines+markers",
              line: {
                width: 6,
                colorscale: "Viridis",
              },
              marker: {
                size: 3.5,
                colorscale: "Greens",
                cmin: -20,
                cmax: 50,
              },
            },
            {
              x: this.props.showMesh ? this.getGeneratedMesh().x : [0],
              y: this.props.showMesh ? this.getGeneratedMesh().y : [0],
              z: this.props.showMesh ? this.getGeneratedMesh().z : [0],
              color: "rgb(300,100,200)",
              type: "mesh3d",
              opacity: 0.3,
            },
          ]}
          layout={{
            autosize: false,
            height: 999,
            width: 1080,
            scene: {
              aspectmode: "manual",
              aspectratio: {
                x: 1,
                y: 1,
                z: 1,
              },
              xaxis: {
                nticks: 9,
                range: [-350, 350],
              },
              yaxis: {
                nticks: 7,
                range: [-350, 350],
              },
              zaxis: {
                nticks: 10,
                range: [-350, 350],
              },
            },

            legend: {
              bgcolor: "#ffffff1c",
              orientation: "h",
              font: {
                color: "black",
                family: "Montserrat",
              },
            },
            title: {
              text: "Quadruped Simulation",
              font: {
                family: "Montserrat",
                size: 24,
                color: "black",
              },

              xref: "paper",
            },
          }}
          frames={[
            {
              // LEG 1
              x: [0, this.leg_1[0][0], this.leg_1[1][0], this.leg_1[2][0]],
              y: [0, this.leg_1[0][1], this.leg_1[1][1], this.leg_1[2][1]],
              z: [0, this.leg_1[0][2], this.leg_1[1][2], this.leg_1[2][2]],
              type: "scatter3d",
              mode: "lines+markers",
              line: {
                width: 6,
                colorscale: "Viridis",
              },
              marker: {
                size: 3.5,
                colorscale: "Reds",
                cmin: -20,
                cmax: 50,
              },
            },
          ]}
        />
      </Container>
    );
  }
}
