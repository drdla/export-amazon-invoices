const selectors = {
  list: {
    currentPage: '#ordersContainer .a-selected',
    numOrders: '#controlsContainer .num-orders-for-orders-by-date .num-orders',
    order: '#ordersContainer .order',
    page: '#yourOrders',
    pager: '#ordersContainer .a-pagination',
    pagerNext: '#ordersContainer .a-pagination .a-last',
    popover: '.a-popover',
    popoverContent: '.a-popover .a-popover-content',
    popoverLinks: '.a-unordered-list .a-list-item a',
    popoverTrigger: '.order-info .actions .a-popover-trigger',
  },
  login: {
    email: '#ap_email',
    form: 'form[name=signIn]',
    password: '#ap_password',
    submit: '#signInSubmit',
  },
};

export default selectors;
