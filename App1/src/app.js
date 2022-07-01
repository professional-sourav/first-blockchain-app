App = {
    contracts: {},
    loading: false,

    load: async () => {
        await App.loadWeb3();
        await App.loadAccounts();
        await App.loadContract();
        await App.render();
    },
   
      // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
         window.addEventListener('load', async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            console.log("Loaded....")
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */});
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */});
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
        });
    },

    loadAccounts: async () => {
        // connect to all the accounts, we want index 0 since, its the first account
        // the account we are connected to
        
        App.account = await ethereum.request({ method: 'eth_accounts' });
        console.log(App.account);

        // App.account = web3.eth.accounts[0];
        // console.log(App.account);
    },
      
    loadContract: async () => {

        const todoList = await $.getJSON( 'TodoList.json' );
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
        

        // Hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed();
        console.log(App.todoList);
    },

    render: async() => {

        if ( App.loading )
            return;

        App.setLoading(true);

        $("#account").html(App.account);

        // render tasks
        await App.renderTasks();

        App.setLoading(false);
    },

    setLoading: (boolean) => {

        App.loading = boolean;

        const loader = $("#loader");
        const content = $("#content");

        if ( boolean ) {
            content.hide();
            loader.show();
        }
        else {
            loader.hide();
            content.show();
        }
    },

    renderTasks: async () => {

        const taskCount = await App.todoList.taskCount();

        console.log(taskCount);

        for (let index = 1; index <= taskCount.toNumber(); index++) {            
            
            const task = await App.todoList.tasks(index);

            console.log(task);

            $("#tasks").append(`<li><span>${task.content}</span> <strong>${task.completed ? "COMPLETED" : "In Progress"}</strong></li>`);
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})