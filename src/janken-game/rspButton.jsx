import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'

import rockIconSrc from './../assets/rock.png';
import scissorsIconSrc from './../assets/scissors.png';
import paperIconSrc from './../assets/paper.png';

/*
function CusButton({index, onSelect = (e, i) => {}}) {
  index = index - 1;
  const imgSorces = [rockIconSrc];
  return (
    <Button
      variant={selection == 1? 'contained':'outlined'}
      onClick={(e) => onSelect(e, index)}
    >
      <img src={imgSorces[index]} alt={toString(imgSorces[index])} height='100px' />
    </Button>
  )
};
*/
function RSPButton({
  onClick = (e, i) => {}
}) {
  return  (
    <Box
      sx={{ 
        display: 'flex',
       gap: '10px',
       flexWrap: 'wrap-reverse',
       justifyContent: 'center'
      }}
    >
      <Button
        variant={selection == 1? 'contained':'outlined'}
        onClick={(e) => onClick(e, 1)}
      >
        <img src={rockIconSrc} alt={toString(rockIconSrc)} height='100px' />
      </Button>
      <Button
        variant={selection == 2? 'contained':'outlined'}
        onClick={(e) => onClick(e, 2)}
      >
        <img src={scissorsIconSrc} alt={toString(scissorsIconSrc)} height='100px' />
      </Button>
      <Button
        variant={selection == 3? 'contained':'outlined'}
        onClick={(e) => onClick(e, 3)}
      >
        <img src={paperIconSrc} alt={toString(paperIconSrc)} height='100px' />
      </Button>
    </Box>
  )
}

export default RSPButton