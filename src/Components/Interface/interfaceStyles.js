import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
  flex-wrap: nowrap;
`;

export const ControlSet = styled.div`
  width: 98%;
  display: flex;

  height: auto;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 5px;
  justify-content: center;
`;

export const Slider = styled.input`
  width: 280px;
  margin-left: 10px;
  margin-right: 10px;
`;

export const SliderControl = styled.div`
  width: 99%;
  height: auto;
  padding: 5px;
  display: flex;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
`;

export const SliderBoxHeader = styled.div`
  color: white;
  font-size: 15px;
  align-self: top;
  font-weight: 500;
`;

export const SliderBoxBody = styled.div`

  display : flex;
  width : 90%;
  height : auto;
  padding : 2px;
  flex-direction : row;
  align-self : center;
  margin : 5px;
  color : white''
  align-items: center;
  justify-content:  center;
  color: white;
`;

export const Label = styled.div`
  margin: 3px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

export const IterButton = styled.div`
  width: 20px;
  height: 35px;
  border-radius: 3px;
  color: white;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  padding: 2px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  user-select: none;
  flex-direction: column;
`;

export const ChoiceBox = styled.div`
  display : flex;
  width : 99%;
  height : auto;
  padding : 2px;
  flex-direction : row;
  align-self : center;
  margin : 5px;
  color : white''
  align-items: center;
  justify-content:  center;
  color: white;
`;

export const ControlSlider = styled.div`
  width: 90%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;

  padding: 5px;
  color: white;
  margin: 2px;
  border-radius: 5px;
`;

export const ChoiceSwitch = styled.div`
  justify-self: flex-end;
  align-self: flex-end;
  width: 50px;
  height: 35px;
  border-radius: 5px;
  display: flex;
  padding: 5px;
  margin: 2px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
`;
