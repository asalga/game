'use strict';

export default function Assert(condition) {
  if (!condition) {
    console.error('Assertion Failed');
    debugger;
  }
}