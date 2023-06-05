// select dom element
const allMatchesEl = document.querySelector('.all-matches');
const addMatchEl = document.querySelector('.lws-addMatch');
const resetEl = document.querySelector('.lws-reset');

// action identifier
const INCREMENT = 'increment';
const DECREMENT = 'decrement';
const ADDANOTHERMATCH = 'addAnotherMatch';
const RESET = 'reset';
const DELETEMATCH = 'deleteMatch';

// action creators
const increment = (id, value) => {
  return {
    type: INCREMENT,
    payload: {
      id,
      value,
    },
  };
};
const decrement = (id, value) => {
  return {
    type: DECREMENT,
    payload: {
      id,
      value,
    },
  };
};
const addAnotherMatch = () => {
  return {
    type: ADDANOTHERMATCH,
  };
};
const deleteMatch = (id) => {
  return {
    type: DELETEMATCH,
    payload: {
      id,
    },
  };
};
const reset = () => {
  return {
    type: 'reset',
  };
};

// Initial state
const initialState = [{ id: 1, score: 0 }];

// create reducer function
const scoreBoardReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return state.map((match) => {
        if (match.id === action.payload.id) {
          return { ...match, score: match.score + action.payload.value };
        }
        return match;
      });
    case DECREMENT:
      return state.map((match) => {
        if (match.id === action.payload.id) {
          return {
            ...match,
            score:
              match.score - action.payload.value > 0
                ? match.score - action.payload.value
                : 0,
          };
        }
        return match;
      });
    case ADDANOTHERMATCH:
      return [
        ...state,
        {
          id: createNewId(state),
          score: 0,
        },
      ];
    case DELETEMATCH:
      return state.filter((match) => match.id !== action.payload.id);
    case RESET:
      return state.map((match) => {
        return { ...match, score: 0 };
      });
    default:
      return state;
  }
};

// create store
const store = Redux.createStore(scoreBoardReducer);

// render function for render UI
const render = () => {
  const state = store.getState();
  const allMatches = state
    .map((match) => {
      const matchElement = `
    <div class="match">
    <div class="wrapper">
      <button onclick="removeMatch(${match.id.toString()})" class="lws-delete">
        <img
          src="./image/delete.svg"
          alt="" />
      </button>
      <h3 class="lws-matchName">Match ${match.id.toString()}</h3>
    </div>
    <div class="inc-dec">
      <form data-id="${match.id}" class="incrementForm">
        <h4>Increment</h4>
        <input
          type="number"
          name="increment"
          class="lws-increment" />
      </form>
      <form data-id="${match.id}" class="decrementForm">
        <h4>Decrement</h4>
        <input
          type="number"
          name="decrement"
          class="lws-decrement" />
      </form>
    </div>
    <div class="numbers">
      <h2 class="lws-singleResult">${match.score}</h2>
    </div>
  </div>
    `;
      return matchElement;
    })
    .join('');
  allMatchesEl.innerHTML = allMatches;
};

// call render function for first time load UI
render();

store.subscribe(render);

// listen event for dispatch actions
addMatchEl.addEventListener('click', () => {
  store.dispatch(addAnotherMatch());
});

allMatchesEl.addEventListener('focusin', () => {
  // function for dispatch action increment or decrement
  const addEventListenerToForms = (queryName, fieldName, action) => {
    const forms = document.querySelectorAll(queryName);
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(e.target.getAttribute('data-id'));
        const value = parseInt(e.target.elements[fieldName].value);
        if (value > 0) {
          store.dispatch(action(id, value));
        } else {
          alert('Invalid input!');
        }
      });
    });
  };
  addEventListenerToForms('.incrementForm', 'increment', increment);
  addEventListenerToForms('.decrementForm', 'decrement', decrement);
});

resetEl.addEventListener('click', () => {
  store.dispatch(reset());
});

// delete match
const removeMatch = (id) => {
  store.dispatch(deleteMatch(id));
};
