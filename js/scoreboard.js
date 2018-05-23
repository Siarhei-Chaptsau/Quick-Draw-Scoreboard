'use strict';

window.onload =  function () {
  document.querySelector('.scoreboard__form').addEventListener('click', function (e) {
    let scoreboardTable = document.querySelector('.scoreboard__table');
    let arrOfName; // массив имён
    let resultObj; // итоговый объект
    let arrOfNameRounds = []; // массив имён раундов
    let arrOfUsersWithResults = []; // массив имён с резалтами раундов

    fetch('dumps/users.json')
      .then(function(response) {        
        return response.json();
       })
      .then(function(users) {
        arrOfName = users; // сохраняем в переменную объект
      })
      .then(
        result => result,
        error => console.log(error.message)
      );

    fetch('dumps/sessions.json')
      .then(function(response) {
        return response.json();
       })
      .then(function(sessions) {
        if (e.target.id === 'rsschool' || e.target.id === 'rsschool-label') {
          scoreboardTable.innerHTML = '';
          resultObj = sessions[0]; // сохраняем в переменную объект
        }
        if (e.target.id === 'rsschool--demo' || e.target.id === 'rsschool--demo-label') {
          scoreboardTable.innerHTML = '';
          resultObj = sessions[1]; // сохраняем в переменную объект
        }
      })
      .then(function() {
        let arrOfPuzzles = resultObj["puzzles"];
        // создаёт массив имён раундов
        for (let i = 0; i < arrOfPuzzles.length; i++) {
          let temp = arrOfPuzzles[i].name;
          arrOfNameRounds.push(temp);
        }
        arrOfNameRounds.push('Total time');
        arrOfNameRounds.unshift('Display Name');
        let arrOfRounds = resultObj["rounds"];
        for (let i = 0; i < arrOfRounds.length; i++) {
          let temp = arrOfRounds[i].solutions;
          arrOfUsersWithResults.push(temp);
        }

        let table = document.createElement('table');
        // добавляем заголовок
        for (let i = 0; i < 1; i++) {
           let newRow = table.insertRow(i);
           for (let j = 0; j < arrOfNameRounds.length; j++) {
             let newCell = newRow.insertCell(j);
             newCell.classList.add('scoreboard__item');
             newCell.classList.add('scoreboard__item--head');
             newCell.innerText = arrOfNameRounds[j];
           }
         }

         for (let i = 1; i < arrOfName.length; i++) { // строка
            let newRow = table.insertRow(i);
            // добавляем первый столбец
            for (let j = 0; j < 1; j++) {
              let newCell = newRow.insertCell(j);
              newCell.classList.add('scoreboard__item');
              newCell.classList.add('scoreboard__item--name');
              newCell.innerText = arrOfName[i - 1]["displayName"];
            }

            // добавляем строки со значением
            for (let j = 1; j < arrOfNameRounds.length - 1; j++) { // столбец, со 2го по предпоследний
              let newCell = newRow.insertCell(j);
              newCell.classList.add('scoreboard__item');
              let temp = arrOfName[i - 1]["uid"]; // первый в списке
              if (arrOfUsersWithResults[j - 1][temp] != undefined
                && arrOfUsersWithResults[j - 1][temp]["correct"] == "Correct"
                && arrOfUsersWithResults[j - 1][temp]["time"]["$numberLong"] < 150) { // обрабатываем только непустые значения
                let numberOfTemp = arrOfUsersWithResults[j - 1][temp]["time"]["$numberLong"];
                newCell.innerText = numberOfTemp;
                newCell.setAttribute('title', arrOfUsersWithResults[j - 1][temp]["code"]); // записываем вариант юзера в атрибут
              } else {
                newCell.innerText = 150;
                newCell.classList.add('scoreboard__item--failure');
              }
            }

            // добавляем резюмирующую строку
            for (let j = arrOfNameRounds.length - 1; j < arrOfNameRounds.length; j++) {
              let temp = arrOfName[i - 1]["uid"]; // первый в списке
              let newCell = newRow.insertCell(j);
              newCell.classList.add('scoreboard__item');
              newCell.classList.add('scoreboard__item--name');
              let sum = 0;
              for (let k = 0; k < arrOfNameRounds.length - 2; k++) {
                if (arrOfUsersWithResults[k][temp] != undefined
                  && arrOfUsersWithResults[k][temp]["correct"] == "Correct"
                  && arrOfUsersWithResults[k][temp]["time"]["$numberLong"] < 150) {
                  if (+arrOfUsersWithResults[k][temp]["time"]["$numberLong"]) {
                    sum += +arrOfUsersWithResults[k][temp]["time"]["$numberLong"];
                  }
                } else {
                  sum += 150;
                }
              }
              newCell.innerText = sum;
            }
          }
          scoreboardTable.appendChild(table);
        })
        .then(
          result => result,
          error => console.log(error.message)
        );
  });
}
