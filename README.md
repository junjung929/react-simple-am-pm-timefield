# React Simple Am Pm Time Field

Simple React time input field with 12/24 hour support.

Demo available [here](https://react-simpe-am-pm-timefield-demo.netlify.app)

## Installation

```bash
npm i react-simple-am-pm-time-field
```

## Usage

```javascript
import TimeField from 'react-simple-am-pm-timefield';
import React, { useEffect, useState } from 'react';

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
