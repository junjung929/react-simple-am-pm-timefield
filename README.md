# React Simple Am Pm Time Field

Simple React time input field with 12/24 hour support.

![image](https://user-images.githubusercontent.com/26710672/147738718-039a2900-5d66-470f-ba1f-3e90385c7a87.png)
![image](https://user-images.githubusercontent.com/26710672/147738881-70290780-db6f-45bc-8026-2a75cda42ea3.png)

Demo available [here](https://react-simpe-am-pm-timefield-demo.netlify.app)

## Installation

```bash
npm i react-simple-am-pm-time-field
```

## Usage

```
import TimeField from 'react-simple-am-pm-time-field';
import React, { useEffect, useState, useRef } from 'react';

const inputRef = useRef < HTMLInputElement > (null);
const [value, setValue] = useState('');

const handleChange = (text: string) => {
  setValue(text);
};

useEffect(() => {
  console.log(value);
}, [value]);

const amPmNames = {
  am: 'AM',
  pm: 'PM',
};

return (
  <TimeField
    ref={inputRef}
    value={value}
    onChange={handleChange}
    isHour12={false}
    amPmNames={amPmNames}
    colon=":"
  />
);
```

## Properties

### Basic Input Properties

- **ref** :

  - type : `RefObject<HTMLInputElement>`
  - optional

- **className** :

  - type : `string`
  - optional

- **id** :

  - type : `string`
  - optional

- **placeHolder** :

  - type : `string`
  - optional

- **title** :

  - type : `string`
  - optional

- **style** :

  - type : `CSS Properties`
  - optional

### Component Properties

- **value** :

  - type : `string`
  - require
  - description : time text
  - format
    - `hh:mm:ss tt`
    - `HH:mm:ss`
    - `hh.mm.ss tt`
    - `HH.mm.ss`

- **onChange** :

  - type : `function`
  - requires
  - description : handler for updating value

- **isHour12** :

  - type : `boolean`
  - optional
  - description : indicator whether time format is 12 or 24 hour.
  - default: `false`

- **colon**:

  - type : `:`, `.`
  - optional
  - description: separator between numbers
  - default: `:`

- **amPmNames**:
  - type : `object`
  - optional
  - description : names for am/pm.
  - default : `{ am: 'AM', pm: 'PM }`

## License

MIT License.
