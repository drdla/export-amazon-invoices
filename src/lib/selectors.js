const selectors = {
  list: {
    numOrders: '#controlsContainer .num-orders-for-orders-by-date .num-orders',
    order: '#ordersContainer .order',
    page: '#yourOrders',
    popoverLinks: '.a-unordered-list .a-list-item a',
    popoverTrigger: '.order-info .actions .a-popover-trigger',
  },
  login: {
    form: 'form[name=signIn]',
    password: '#ap_password',
    submit: '#signInSubmit',
    user: '#ap_email',
  },
};

export default selectors;
