<template>
  <v-simple-table fixed-header height="300px">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Calories</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in information" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  props: {
    socket: {
      type: Object,
      required: true
    }
  },
  mounted () {
    ipcRenderer.send('getInformation', this.socket.id)
    ipcRenderer.on('systeminfo', (event, data) => {
      console.log(data)
    })
  },
  dat () {
    return {
      information: []
    }
  }
}
</script>
