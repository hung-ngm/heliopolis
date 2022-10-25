import React, { FC, useEffect } from 'react';
import { IExplore } from './types';

const Explore: FC<IExplore> = ({ marketplace }) => {
    useEffect(() => console.log('market', marketplace), [marketplace]);
  
    return (
    <>
        <h1>Hello Explore</h1>
    </>
  );
};

export default Explore;