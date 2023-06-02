<?php
// PostgreSQL database connection settings
$host = 'localhost';
// $port = 'your_port';
$dbname = 'mydb';
$user = 'my';
$password = 'root';

// URL of the JSON data
$url = 'https://ransom.brooklyn-bridge.nl/api/game';

// Fetch JSON data from the URL
$jsonData = file_get_contents($url);

// Decode the JSON data
$data = json_decode($jsonData, true);

// Connect to the PostgreSQL database
$dsn = "pgsql:host=$host;dbname=$dbname;user=$user;password=$password";
$db = new \PDO($dsn);

// Prepare the SQL statement for insertion
$sql = "INSERT INTO ttable (id, name, code) VALUES (:id, :name, :code)";

// Iterate through each item in the data array
foreach ($data as $item) {
    // Bind the values to the parameters in the SQL statement
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':id', $item['id']);
    $stmt->bindValue(':name', $item['name']);
    $stmt->bindValue(':code', $item['code']);

    // Execute the SQL statement
    $stmt->execute();
}


// Prepare the SQL statement for retrieval
$sql = "SELECT * FROM ttable";

// Execute the SQL statement
$stmt = $db->query($sql);

// Fetch all rows as an associative array
$rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

// Loop through the rows and display the data
foreach ($rows as $row) {
    echo "ID: " . $row['id'] . "<br>";
    echo "Name: " . $row['name'] . "<br>";
    echo "Code: " . $row['code'] . "<br>";
    echo "<br>";
}

echo "Data inserted successfully!";
