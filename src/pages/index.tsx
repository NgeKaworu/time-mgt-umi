import React,{useEffect} from 'react';
import {RESTful } from '@/http'

export default () => {
  useEffect(()=>{
    console.log("123")
    // RESTful.get('/main/v1/tag/list?limit=1&skip=2')
  })
  return (
    <div>
      <h1 >Page index</h1>
    </div>
  );
}
