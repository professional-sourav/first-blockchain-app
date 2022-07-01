pragma solidity ^0.8.15;

contract TodoList {

    uint public taskCount = 0;

    struct Task {

        uint    id;
        string  content;
        bool    completed;
    }

    mapping(uint => Task) public tasks;

    constructor() public {

        createTask("This is first task");
    }

    function createTask(string memory _content) public {

        tasks[ ++taskCount ] = Task( taskCount, _content, false );
    }

    function toggleCompleted(uint _id) public {

        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;

        tasks[_id] = _task;
    }
}