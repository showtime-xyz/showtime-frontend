import styled from "styled-components";

const LoadingSpinner = styled.div`
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 4px solid #eee;
    border-radius: 50%;
    border-top-color: #223043;
    animation: spin 1s cubic-bezier(0.75, 0, 0.25, 1) infinite;
    -webkit-animation: spin 1s cubic-bezier(0.75, 0, 0.25, 1) infinite;
`;

export default LoadingSpinner;
