import styled from 'styled-components'
//# Still needs alphabetizing

export const SCHorizontalRuler = styled.div<{ color?: string }>`
  --color: ${({ color }) => (color ? color : '#440099')};
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  position: relative;
  left: 50%;
  // This avoids using margin: 50px auto, which would cause the horizontal ruler to
  // compress if placed directly within a flex container with column orientation.
  transform: translateX(-50%);
  max-width: 1000px;
  margin: 0;
  border-top: 1px solid var(--color);

  hr {
    border: 0;
    box-sizing: border-box;
    position: relative;
    top: -12px;
    width: 10px;
    height: 1px;
    left: 0;
    margin: 16px 0;
    background-color: var(--color);
    transform-origin: 0% 0%;
    opacity: 1;
    /* overflow: visible; /* Overwrite Chrome */
  }

  hr:nth-child(1) {
    transform: rotate(90deg);
  }
  hr:nth-child(2) {
    transform: rotate(90deg);
  }
  hr:nth-child(3) {
    transform: rotate(90deg);
  }
  hr:nth-child(4) {
    transform: rotate(90deg);
  }
  hr:nth-child(5) {
    width: 15px;
    margin-right: -5px;
    transform: rotate(90deg);
  }

  hr:nth-child(6) {
    transform: rotate(90deg);
  }
  hr:nth-child(7) {
    transform: rotate(90deg);
  }
  hr:nth-child(8) {
    transform: rotate(90deg);
  }
  hr:nth-child(9) {
    transform: rotate(90deg);
  }
  hr:nth-child(10) {
    width: 25px;
    margin-right: -15px;
    transform: rotate(90deg);
  }
  hr:nth-child(11) {
    transform: rotate(90deg);
  }
  hr:nth-child(12) {
    transform: rotate(90deg);
  }
  hr:nth-child(13) {
    transform: rotate(90deg);
  }
  hr:nth-child(14) {
    transform: rotate(90deg);
  }
  hr:nth-child(15) {
    width: 15px;
    margin-right: -5px;
    transform: rotate(90deg);
  }

  hr:nth-child(16) {
    transform: rotate(90deg);
  }
  hr:nth-child(17) {
    transform: rotate(90deg);
  }
  hr:nth-child(18) {
    transform: rotate(90deg);
  }
  hr:nth-child(19) {
    transform: rotate(90deg);
  }
  hr:nth-child(20) {
    width: 40px;
    margin-right: -30px;
    transform: rotate(90deg);
  }
  hr:nth-child(21) {
    transform: rotate(90deg);
  }
  hr:nth-child(22) {
    transform: rotate(90deg);
  }
  hr:nth-child(23) {
    transform: rotate(90deg);
  }
  hr:nth-child(24) {
    transform: rotate(90deg);
  }
  hr:nth-child(25) {
    width: 15px;
    margin-right: -5px;
    transform: rotate(90deg);
  }
  hr:nth-child(26) {
    transform: rotate(90deg);
  }
  hr:nth-child(27) {
    transform: rotate(90deg);
  }
  hr:nth-child(28) {
    transform: rotate(90deg);
  }
  hr:nth-child(29) {
    transform: rotate(90deg);
  }
  hr:nth-child(30) {
    width: 25px;
    margin-right: -15px;
    transform: rotate(90deg);
  }

  hr:nth-child(31) {
    transform: rotate(90deg);
  }
  hr:nth-child(32) {
    transform: rotate(90deg);
  }
  hr:nth-child(33) {
    transform: rotate(90deg);
  }
  hr:nth-child(34) {
    transform: rotate(90deg);
  }
  hr:nth-child(35) {
    width: 15px;
    margin-right: -5px;
    transform: rotate(90deg);
  }
  hr:nth-child(36) {
    transform: rotate(90deg);
  }
  hr:nth-child(37) {
    transform: rotate(90deg);
  }
  hr:nth-child(38) {
    transform: rotate(90deg);
  }
  hr:nth-child(39) {
    transform: rotate(90deg);
  }

  hr:last-child {
    margin-right: -10px;
  } /* This assumes that the final line has width: 10px; */

  @media (max-width: 575px) {
    hr:nth-child(2),
    hr:nth-child(3),
    hr:nth-child(4),
    hr:nth-child(5),
    hr:nth-child(6),
    hr:nth-child(34),
    hr:nth-child(35),
    hr:nth-child(36),
    hr:nth-child(37),
    hr:nth-child(38) {
      display: none;
    }
  }

  @media (max-width: 450px) {
    hr:nth-child(15),
    hr:nth-child(16),
    hr:nth-child(17),
    hr:nth-child(18),
    hr:nth-child(19),
    hr:nth-child(21),
    hr:nth-child(22),
    hr:nth-child(23),
    hr:nth-child(24),
    hr:nth-child(25) {
      display: none;
    }

    hr:nth-child(10) {
      width: 15px;
      margin-right: -5px;
      transform: rotate(90deg);
    }

    hr:nth-child(20) {
      width: 25px;
      margin-right: -15px;
      transform: rotate(90deg);
    }

    hr:nth-child(30) {
      width: 15px;
      margin-right: -5px;
      transform: rotate(90deg);
    }
  }

  @media (max-width: 400px) {
    margin: 50px auto;
    max-width: 300px;

    hr:nth-child(7),
    hr:nth-child(8),
    hr:nth-child(11),
    hr:nth-child(12),
    hr:nth-child(26),
    hr:nth-child(27),
    hr:nth-child(30),
    hr:nth-child(31) {
      display: none;
    }
  }
`
