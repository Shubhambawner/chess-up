## General:
1. React ensures that for each user-initiated event like a click or a keypress, the DOM is fully updated before the next event.
2. adding images into JSX componts: in client side rendering, we have to inport images like other JSX components, then use them in src attr of img tag.
-> then while sending to client, the app is compressed to webpack, and there the images are included as import statements are seen.

## Hooks: 
1. 2 rules: https://reactjs.org/docs/hooks-rules.html 
    same order, and without any conditions order.
    otherwise: we get error, as order in which hooks are renderd is remembered each time to identify and execute them.
    Error:
    Rendered more hooks than during the previous render.
2. Working of hooks:
    Each call to a Hook gets an independant state.(unlike class component, which has its own state)
    We can call hooks many times inside any function component body
    on each re render, hook is identified and maped by the order in which it is created,
    ex. ``` [a,setA] = useState(100)
            [b,setB] = useState(100)``` 
    hook creates 2 states with a = 100, b=100, identified by the order alone
    on a re-render, this a,b are going to get modified value, based on just the order in which hooks apear, if conditionally this order changes, i.e. b apears b4 a, b will get the value from state that was created by a & vice versa !
3.  Custom hooks: https://reactjs.org/docs/hooks-custom.html 
     Custom Hooks are a mechanism to reuse stateful logic (such as setting up a subscription and remembering the current value)
    - its just a simple JS function which uses Hooks, 
    - but can be called Only inside any functional component , 
    - from React’s point of view our component just calls useState and useEffect indirectly through a function.
4.  Automatic Batching of state updates to reduce re-renders:
    https://github.com/reactwg/react-18/discussions/21

## Hook: useReducer : https://reactjs.org/docs/hooks-reference.html#usereducer 
    - useReducer is usually preferable over useState when you have complex state logic, noth are SIMILER
    - const [state, dispatch] = useReducer(reducer, initialArg, init);
        - state: state, re renders when change...
        - dispatch: call it `dispatch("ACTION1")` function that can call reducer to change state with different actions differently
        - reducer: 
            function reducer(state, action) {
                switch (action.type) {
                    case 'increment':
                    return {...state, change1};
                    case 'decrement':
                    return {...state, change2};
                    default:
                    throw new Error();
                }
            }
        - init: funtion, The initial state will be set to init(initialArg)

## Hook: useMemo: 
    - to avoid re-computing computationally high function, when its dependancies change
    - const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
    OR
    - const memoizedValue = useCallback(() => computeExpensiveValue(a, b), [a, b]);
    - when memoizedValue(a,b) is called, if a,b==initial a,b , it wont run again
    
## Context API: https://reactjs.org/docs/hooks-reference.html#usecontext 
    - `const ThemeContext = React.createContext();` in App's body
    - export it and import it apropriately, to be used like a component
    - App returns: 
        <ThemeContext.Provider value={{"any data":"to be passed down"}}>
            <GrandParent />
        </ThemeContext.Provider>
    - access `value` in any successor element of GrandParent as:
        const theme = useContext(ThemeContext);


## Memo API
0.  let MemoComponent = React.memo(MyComponent, areEqual);
    areEqual gives true: will NOT re render
1.  for class components:  https://codesandbox.io/s/memo-roj4si?file=/src/App.js
    API creates the additional wraper component aroundd the actual rendered component, so mostly we try to use shouldComponentUpdate instead.
2.  If your function component renders the same result given the same props, you can wrap it in a call to React. memo for a performance boost in some cases by memoizing the result.
3.  React.memo only checks for prop changes shallow comparison by default.
4.  custom comparison function can be passed as 2nd arg.: function areEqual(prevProps, nextProps) {..

## Ref API: 
#### not recomended to replace re-rendering based aproach to "make things hapen", only cases where we need css/dom animations, styling changes... & rare cases
0.  this.textInput = React.createRef(); // in constructor/body of fn based component
    pass attribute : `<someElement ref={this.textInput} />`
    and access someElement as: this.textInput.current
1. provides referance to DOM elements OR mounted instance of class based child elements
        - for a functional child component, we can not controll it's instances on DOM via ref
        (as there are no "instances" for it, DOM has only what it returns, not any JS object as instance)
2. parent element can call DOM APIs over a DOM elements, to make changes like animations or effects like focus...
3. parent can controll mounted class based element via methods decleared inside that class, ( how we do in OOPS based methodology...)
4.  Forward ref:
        - Parent -> Child -> GrandChild
        if ref passed to Child is forwarded to GrandChild, it can be controlled/accessed by parent 
5. Other USE: https://codesandbox.io/s/class-vs-function-component-1bwlwb?file=/src/App.js 
to store data to functional element that is not affected by re-rendering, and dosnt triger re-rendering(as changing state causes re-rendering, as well as other let/var devleared inside get re-set to initial values on every re-render), similer to class elements class attributes


## React.lazy() API
0   lazy takes inn the promice, that returns React element, that renders after promice is fulfilled
1.  const SomeComponent = React.lazy(() => import('./SomeComponent'));
2.  return(
        <React.Suspense fallback={<h4>loading...</h4>}>
            <SomeComponent />
        </React.Suspense>
    )
3. USE: 
    in client side rendering:  to achive code splitting, i.e. reduce bundle size that is passed over network, and achieve "lazy loading"

     