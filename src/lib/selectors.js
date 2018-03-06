const selectors = {
  list: {
    numOrders: '#controlsContainer .num-orders-for-orders-by-date .num-orders',
    order: '#ordersContainer .order',
    orderDetails: {
      article: '.shipment .a-col-left .a-col-right .a-row:first-of-type .a-link-normal',
      date: '.order-info .a-col-left > .a-row > .a-span4 > .a-size-base .value',
      id: '.order-info .actions > .a-row:first-of-type .value',
      total: '.order-info .a-col-left > .a-row > .a-span2 > .a-size-base .value',
      url: '.order-info .actions .a-row:nth-of-type(2) > .a-unordered-list > .a-link-normal:first-of-type',
    },
    page: '#yourOrders',
    popoverLinks: '.a-unordered-list .a-list-item a',
    popoverTrigger: '.order-info .actions .a-popover-trigger',
  },
  login: {
    continue: '#continue',
    form: 'form[name=signIn]',
    password: '#ap_password',
    submit: '#signInSubmit',
    user: '#ap_email',
  },
};

export default selectors;
