import React from 'react';
import Counter from './Counter';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: {
        components: [],
        data: {},
      },
    };
  }

  componentDidMount = () => {
    this.appendCounter({name: 'Sample Counter'});
  }

  appendCounter = ({value, initial, min, max, step, name}) => {
    // TODO - Validate user input (check safe integer)
    const counterComopnents = this.state.counter.components.slice();
    const counterData = {...this.state.counter.data};
    const handleCounterChange = (newValue) => {
      this.updateCounter(name, newValue);
    };
    const newCounter = (
      <Counter
        key={name}
        value={value}
        initial={initial}
        min={min}
        max={max}
        step={step}
        name={name}
        onChange={handleCounterChange}
      />
    );
    counterData[name] = {
      value: newCounter.props.value,
      initial: newCounter.props.initial,
      min: newCounter.props.min,
      max: newCounter.props.max,
      step: newCounter.props.step,
      name: newCounter.props.name,
    };
    counterComopnents.push(newCounter);
    this.setState({
      counter: {
        components: counterComopnents,
        data: counterData,
      },
    });
  }

  updateCounter = (name, newCounterValue) => {
    const oldCounterComopnents = this.state.counter.components;
    const counterDatum = {...this.state.counter.data[name]};
    const counterComponentIndex = oldCounterComopnents.findIndex((component) => component.props.name === name);
    if (counterComponentIndex < 0) {
      return;
    }

    counterDatum.value = newCounterValue;

    const newCounter = (
      <Counter
        key={name}
        value={counterDatum.value}
        initial={counterDatum.initial}
        min={counterDatum.min}
        max={counterDatum.max}
        step={counterDatum.step}
        name={counterDatum.name}
        onChange={oldCounterComopnents[counterComponentIndex].props.onChange}
      />
    );

    const counterData = {...this.state.counter.data};
    counterData[name] = counterDatum;

    this.setState({
      counter: {
        components: [
          ...oldCounterComopnents.slice(0, counterComponentIndex),
          newCounter,
          ...oldCounterComopnents.slice(counterComponentIndex + 1)
        ],
        data: counterData,
      },
    });
  }

  render = () => {
    return (
      <div className="App">
        <header>
          {/* TODO - Add header */}
        </header>

        <section>
          {this.state.counter.components}
        </section>

        <aside>
          {/* TODO - Add sidebar (menu for small devices) */}
        </aside>
      </div>
    );
  }
}

export default App;