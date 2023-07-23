# SlotMachine

> This component is the main gameplay

## Props

| Prop name                       | Description                                                                                                              | Type                | Values | Default                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------- | ------ | ------------------------------------------------------------------------------------------- |
| initialCredit                   | Initial credit amount                                                                                                    | number              | -      | 10                                                                                          |
| initialDisplayShape             | Initial display shape. default is all shapes are cherry                                                                  | TSIndexedAccessType | -      | () =&gt; ({<br/> shape: "c",<br/> isRolling: false,<br/>})                                  |
| numberOfShapes                  | Number of shapes that you will see on the machine.                                                                       | number              | -      | 3                                                                                           |
| shapesIncludedForRolling        | Shapes that you want to be included in rolling.                                                                          | Array               | -      | () =&gt;<br/> Object.keys(shapes) as unknown as Array&lt;DisplayShapes[number]["shape"]&gt; |
| rollingTimeout                  | The timer that how much rolling should take long. It is based on milliseconds and will increased based on numberOfShapes | number              | -      | 1000                                                                                        |
| cashOutHoverMoveDirectionChance | The chance of cash out move on hover. Should be between 0 and 1.                                                         | number              | -      | 0.5                                                                                         |
| cashOutHoverDisableClickChance  | The chance of cash out disable click on hover. Should be between 0 and 1.                                                | number              | -      | 0.4                                                                                         |

---
