const paths={
 'arrow-up-right':'M5 19 19 5M5 5h14v14',
 'arrow-down':'M12 4v16m-7-7 7 7 7-7',
 'arrow-up':'M12 20V4m-7 7 7-7 7 7',
 'arrow-left':'M20 12H4m7-7-7 7 7 7',
 play:'m8 5 11 7-11 7Z',
 pause:'M8 5v14M16 5v14',
 menu:'M4 8h16M4 16h16',
 close:'m6 6 12 12M6 18 18 6',
 plus:'M12 5v14M5 12h14',
};

// Paths, rather than Unicode glyphs, keep icons consistent on iOS and Android.
export default function Icon({name='arrow-up-right',className=''}){
 return <svg className={`icon icon-${name} ${className}`.trim()} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]||paths['arrow-up-right']}/></svg>;
}
