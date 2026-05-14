// customer list (fake database)
let customers = []

// Add customer
function addCustomer(name){
    customers.push(name);
    console.log("Added", name);
    displayCustomers(); 
} 

// Show customers
function displayCustomers(){
    console.log("Customer List:");
    customers.forEach((customer, index) => {
        console.log(index + 1 + ". " + c);
    });
}

// Delete customer
function deleteCustomer(index){
    let removed = customers.splice(index, 1);
    console.log("Deleted", removed[0]);
    displayCustomers();
}

// Testing prototype
addCustomer("Alice");
addCustomer("Bob");
addCustomer("Charlie");

deleteCustomer(1);