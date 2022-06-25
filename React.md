1. react component life cycle: 
class based components: https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
 a. constructor :: 
 b. render
 c. componentDidMount
 d. setState/forceUpdate/props change
 e. shouldComponentUpdate
 f. componentDidUpdate
 g. componentWillUnmount
function based components: Hooks : https://reactjs.org/docs/hooks-overview.html 
 a. function body ::: constructor+render body
 b. useState ::: setState/forceUpdate
 b. useReducer ::: setState/forceUpdate + complexicities
 c. useEffect :::   componentDidUpdate(empty array passed)
                    componentWillUnmount(call-back returns function)
                    componentDidMount(no array passed)
                    https://reactjs.org/docs/hooks-effect.html 
 d. useRef ::: class instance's attribute/ createRef API
 e. useMemo ::: avoid re-computation 

2. react API
a. memo API: to avoid re-rendering
b. context API: to avoid repetative props passing 
c. ref API: to controll DOM elements/ class based components
d. lazy + suspend : 
