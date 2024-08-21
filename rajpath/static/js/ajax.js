const district = document.getElementById('districts');
    const assembly = document.getElementById('assemblies');

    district.addEventListener('change', (event) => {
      const districtId = event.target.value;
      fetch(`get_assemblies/${districtId}`)
        .then(response => response.json())
        .then(data => {
          assembly.innerHTML = '';
          data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.text = item.name;
            assembly.add(option);
          });
        });
    });