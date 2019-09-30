export default function createPubsub() {
  const topics = {};
  let id = 1;

  const subscribe = (topic, callback) => {
    const subId = (id += 1).toString();

    (topics[topic] || (topics[topic] = [])).push({
      id: subId,
      callback,
    });

    return function cancelSubscribe() {
      if (this.done) {
        return;
      }
      this.done = true;
      topics[topic] = topics[topic].filter(subObj => subObj.id !== subId);
    }.bind({});
  };

  const publish = (topic, ...datas) => {
    const subObjs = topics[topic];
    if (!subObjs || !subObjs.length) {
      return false;
    }
    const { length } = subObjs;
    let i = 0;
    do {
      subObjs[i].callback.apply(undefined, datas);
      i += 1;
    } while (i < length);
    return true;
  };

  return {
    subscribe,
    publish,
  };
}
