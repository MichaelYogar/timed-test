import * as React from "react";

// const MinusSquareO: React.FC = (props) => (
//   <svg {...props} viewBox="64 -65 897 897">
//     <g>
//       <path
//         d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 347h-442q-14 0 -25 10.5t-11 25.5v0q0 15 11 25.5t25 10.5h442q14 0 25 -10.5t11 -25.5v0
//   q0 -15 -11 -25.5t-25 -10.5z"
//       />
//     </g>
//   </svg>
// );

const MinusSquareO: React.FC = (props) => (
  <svg
    {...props}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 3C2.22386 3 2 3.22386 2 3.5V9.5C2 9.77614 2.22386 10 2.5 10H12.5C12.7761 10 13 9.77614 13 9.5V3.5C13 3.22386 12.7761 3 12.5 3H2.5ZM1 9.5C1 10.1531 1.4174 10.7087 2 10.9146V11.5C2 12.3284 2.67157 13 3.5 13H11.5C12.3284 13 13 12.3284 13 11.5V10.9146C13.5826 10.7087 14 10.1531 14 9.5V3.5C14 2.67157 13.3284 2 12.5 2H2.5C1.67157 2 1 2.67157 1 3.5V9.5ZM12 11.5V11H3V11.5C3 11.7761 3.22386 12 3.5 12H11.5C11.7761 12 12 11.7761 12 11.5ZM5.5 6C5.22386 6 5 6.22386 5 6.5C5 6.77614 5.22386 7 5.5 7H9.5C9.77614 7 10 6.77614 10 6.5C10 6.22386 9.77614 6 9.5 6H5.5Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    ></path>
  </svg>
);

// const PlusSquareO: React.FC = (props) => (
//   <svg {...props} viewBox="64 -65 897 897">
//     <g>
//       <path
//         d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 420h-184v183q0 15 -10.5 25.5t-25.5 10.5v0q-14 0 -25 -10.5t-11 -25.5v-183h-184
//   q-15 0 -25.5 -11t-10.5 -25v0q0 -15 10.5 -25.5t25.5 -10.5h184v-183q0 -15 11 -25.5t25 -10.5v0q15 0 25.5 10.5t10.5 25.5v183h184q15 0 25.5 10.5t10.5 25.5v0q0 14 -10.5 25t-25.5 11z"
//       />
//     </g>
//   </svg>
// );

const PlusSquareO: React.FC = (props) => (
  <svg
    {...props}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12ZM5 6.5C5 6.22386 5.22386 6 5.5 6H7V4.5C7 4.22386 7.22386 4 7.5 4C7.77614 4 8 4.22386 8 4.5V6H9.5C9.77614 6 10 6.22386 10 6.5C10 6.77614 9.77614 7 9.5 7H8V8.5C8 8.77614 7.77614 9 7.5 9C7.22386 9 7 8.77614 7 8.5V7H5.5C5.22386 7 5 6.77614 5 6.5Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    ></path>
  </svg>
);

// const CloseSquareO: React.FC = (props) => (
//   <svg {...props} viewBox="64 -65 897 897">
//     <g>
//       <path
//         d="M717.5 589.5q-10.5 10.5 -25.5 10.5t-26 -10l-154 -155l-154 155q-11 10 -26 10t-25.5 -10.5t-10.5 -25.5t11 -25l154 -155l-154 -155q-11 -10 -11 -25t10.5 -25.5t25.5 -10.5t26 10l154 155l154 -155q11 -10 26 -10t25.5 10.5t10.5 25t-11 25.5l-154 155l154 155
//   q11 10 11 25t-10.5 25.5zM888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0z"
//       />
//     </g>
//   </svg>
// );

const CloseSquareO: React.FC = (props) => (
  <svg
    {...props}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 9.125C8.39746 9.125 9.125 8.39746 9.125 7.5C9.125 6.60254 8.39746 5.875 7.5 5.875C6.60254 5.875 5.875 6.60254 5.875 7.5C5.875 8.39746 6.60254 9.125 7.5 9.125ZM7.5 10.125C8.94975 10.125 10.125 8.94975 10.125 7.5C10.125 6.05025 8.94975 4.875 7.5 4.875C6.05025 4.875 4.875 6.05025 4.875 7.5C4.875 8.94975 6.05025 10.125 7.5 10.125Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    ></path>
  </svg>
);

export { PlusSquareO, MinusSquareO, CloseSquareO };
