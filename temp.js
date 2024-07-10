// Function to transform the existing array and create a new structure
function transformAndAddCategory(existingLinks, newCategoryName) {
    // Create a new category for the existing links
    const newCategory = {
      name: newCategoryName,
      links: existingLinks.map(link => ({
        name: link.name,
        url: link.url
      }))
    };
  
    // Create a new category with example links
    const exampleCategory = {
      name: "Soti Tablets",
      links: [
        { name: "MobiControl", url: "https://a0017321.mobicontrol.cloud/MobiControl/WebConsole/home/dashboard/devices?groups=%5C%5CGisborne%20Loader%20Tablets&subGroups=false&count=100" },
        { name: "Example Link 2", url: "https://example2.com" }
      ]
    };
  
    // Return the array of categories
    return [newCategory, exampleCategory];
  }
  
  // Existing localStorage array
  const existingLinks = [
    {"url":"https://a0017321.mobicontrol.cloud/MobiControl/WebConsole/home/dashboard/devices?groups=%5C%5CGisborne%20Loader%20Tablets&subGroups=false&count=100","name":"SOTI MobiControl"},
    {"url":"https://qubeau.service-now.com/now/nav/ui/classic/params/target/incident_list.do%3Fsysparm_first_row%3D1%26sysparm_query%3Dassignment_group%253D921304c01b1a4ed0c1a676ebdc4bcb6b%255EstateNOT%2BIN6%252C7%252C8%26sysparm_view%3D","name":"Service Desk"},
    {"url":"https://192.168.145.232/#dashboard","name":"Ubiquiti Link Control"}
  ];
  
  // Transform the existing links and add a new category
  const transformedCategories = transformAndAddCategory(existingLinks, "MHC");
  
  console.log(transformedCategories);
  
  // Output the transformed categories to localStorage (optional)
  localStorage.setItem('linksArray', JSON.stringify(transformedCategories));
  