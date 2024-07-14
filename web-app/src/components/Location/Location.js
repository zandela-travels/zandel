import React from 'react'

const Location = () => {
  return (
    <div>
       <select id="location" onChange={onchange}>
                  <option value='Any'>Any</option>
                <optgroup label='Colombo District'>
                  <option value='Colombo'>Colombo</option>
                  <option value='Dehiwala-Mount-Lavinia'>Dehiwala-Mount-Lavinia</option>
                  <option value='Moratuwa'>Moratuwa</option>
                  <option value='Battaramulla'>Battaramulla</option>
                  <option value='Maharagama'>Maharagama</option>
                  <option value='Kotte'>Kotte</option>
                  <option value='Kotikawatta'>Kotikawatta</option>
                  <option value='Kolonnawa'>Kolonnawa</option>
                  <option value='Keselwatta'>Keselwatta</option>
                  <option value='Homagama'>Homagama</option>
                  <option value='Mulleriyawa'>Mulleriyawa</option>
                  <option value='Avissawella'>Avissawella</option>
                  <option value='Kesbewa'>Kesbewa</option>
                  <option value='Kaduwela'>Kaduwela</option>
                  <option value='Boralesgamuwa'>Boralesgamuwa</option>
                  <option value='Piliyandala'>Piliyandala</option>
                  <option value='Nugegoda'>Nugegoda</option>
                  <option value='Nawala'>Nawala</option>
                  <option value='Padukka'>Padukka</option>
                  <option value='Kottawa'>Kottawa</option>
                  <option value='Pannipitiya'>Pannipitiya</option>
                  <option value='Malabe'>Malabe</option>
                  <option value='Hanwella'>Hanwella</option>
                  <option value='Rajagiriya'>Rajagiriya</option>  
                </optgroup>
          
                <optgroup label='Gampaha District'>
                  <option value='Gampaha'>Gampaha</option>
                  <option value='Negombo'>Negombo</option>
                  <option value='Katunayake'>Katunayake</option>
                  <option value='Hendala'>Hendala</option>
                  <option value='Welisara'>Welisara</option>
                  <option value='Ragama'>Ragama</option>
                  <option value='Kandana'>Kandana</option>
                  <option value='Ja Ela'>Ja Ela</option>
                  <option value='Wattala'>Wattala</option>
                  <option value='Kelaniya'>Kelaniya</option>
                  <option value='Peliyagoda'>Peliyagoda</option>
                  <option value='Minuwangoda'>Minuwangoda</option>
                  <option value='Kadawatha'>Kadawatha</option>
                  <option value='Dompe'>Dompe</option>
                  <option value='Divulapitiya'>Divulapitiya</option>
                  <option value='Nittambuwa'>Nittambuwa</option>
                  <option value='Meerigama'>Meerigama</option>
                  <option value='Kiribathgoda'>Kiribathgoda</option>
                  <option value='Veyangoda'>Veyangoda</option>
                  <option value='Ganemulla'>Ganemulla</option>
                </optgroup>

                <optgroup label='Kandy District'>
                  <option  value='Kandy'>Kandy</option>
                  <option  value='Gampola'>Gampola</option>
                  <option  value='Nawalapitiya'>Nawalapitiya</option>
                  <option  value='Wattegama'>Wattegama</option>
                  <option  value='Harispattuwa'>Harispattuwa</option>
                  <option  value='Kadugannawa'>Kadugannawa</option>
                </optgroup>

                <optgroup label='Kurunegala District'>
                  <option value='Kurunegala'>Kurunegala</option>
                  <option value='Kuliyapitiya'>Kuliyapitiya</option>
                  <option value='Polgahawela'>Polgahawela</option>
                  <option value='Pannala'>Pannala</option>
                </optgroup>

                <optgroup label='Ratnapura District'>
                  <option value='Ratnapura'>Ratnapura</option>
                  <option value='Balangoda'>Balangoda</option>
                  <option value='Eheliyagoda'>Eheliyagoda</option>
                  <option value='Kalawana'>Kalawana</option>
                  <option value='Embilipitiya'>Embilipitiya</option>
                </optgroup>

                <optgroup label='Kalutara District'>
                  <option value='Kalutara'>Kalutara</option>
                  <option value='Beruwala'>Beruwala</option>
                  <option value='Panadura'>Panadura</option>
                  <option value='Horana'>Horana</option>
                  <option value='Matugama'>Matugama</option>
                  <option value='Bandaragama'>Bandaragama</option>
                </optgroup>

                <optgroup label='Puttalam District'>
                  <option value='Puttalam'>Puttalam</option>
                  <option value='Chillaw'>Chillaw</option>
                  <option value='Nattandiya'>Nattandiya</option>
                  <option value='Wennappuwa'>Wennappuwa</option>
                  <option value='Marawila'>Marawila</option>
                  <option value='Dankotuwa'>Dankotuwa</option>
                </optgroup>

                <optgroup label='Kegalle District'>
                  <option value='Kegalle'>Kegalle</option>
                  <option value='Mawanella'>Mawanella</option>
                  <option value='Warakapola'>Warakapola</option>
                </optgroup>

                <optgroup label='Matale District'>
                  <option value='Matale'>Matale</option>
                  <option value='Dambulla'>Dambulla</option>
                  <option value='Sigiriya'>Sigiriya</option>
                </optgroup>

                <optgroup label='Badulla District'>
                  <option value='Badulla'>Badulla</option>
                  <option value='Bandarawela'>Bandarawela</option>
                  <option value='Haputale'>Haputale</option>
                  <option value='Welimada'>Welimada</option>
                  <option value='Mahiyanganaya'>Mahiyanganaya</option>
                </optgroup>

                <optgroup label='Nuwara-Eliya District'>
                  <option value='Nuwara-Eliya'>Nuwara-Eliya</option>
                  <option value='Hatton'>Hatton</option>
                  <option value='Talawakele'>Talawakele</option>
                </optgroup>

                <optgroup label='Galle District'>
                  <option value='Galle'>Galle</option>
                  <option value='Ambalangoda'>Ambalangoda</option>
                  <option value='Benthota'>Benthota</option>
                  <option value='Hikkaduwa'>Hikkaduwa</option>
                  <option value='Elpitiya'>Elpitiya</option>
                  <option value='Koggala'>Koggala</option>
                </optgroup>

                <optgroup label='Matara District'>
                  <option value='Matara'>Matara</option>
                  <option value='Weligama'>Weligama</option>
                </optgroup>

                <optgroup label='Hambanthota District'>
                  <option value='Hambanthota'>Hambanthota</option>
                  <option value='Tangalle'>Tangalle</option>
                </optgroup>

                <optgroup label='Batticaloa District'>
                  <option value='Batticaloa'>Batticaloa</option>
                  <option value='Kattankudy'>Kattankudy</option>
                  <option value='Eravur'>Eravur</option>
                </optgroup>

                <optgroup label='Ampara District'>
                  <option value='Ampara'>Ampara</option>
                  <option value='Kalmunai'>Kalmunai</option>
                </optgroup>

                <optgroup label='Jaffna District'>
                  <option value='Jaffna'>Jaffna</option>
                  <option value='Chavakachcheri'>Chavakachcheri</option>
                  <option value='Valvettinurai'>Valvettinurai</option>
                </optgroup>

                <optgroup label='Anuradhapura District'>
                  <option value='Anuradhapura'>Anuradhapura</option>
                  <option value='Bulnewa'>Bulnewa</option>
                  <option value='Eppawala'>Eppawala</option>
                  <option value='Galnewa'>Galnewa</option>
                  <option value='Ganewalpola'>Ganewalpola</option>
                  <option value='Habarana'>Habarana</option>
                  <option value='Kahatagasdeniya'>Kahatagasdeniya</option>
                  <option value='Kekirawa'>Kekirawa</option>
                  <option value='Medawachchiya'>Medawachchiya</option>
                </optgroup>

                <optgroup label='Polonnaruwa District'>
                  <option value='Polonnaruwa'>Polonnaruwa</option>
                  <option value='Dimbulagala'>Dimbulagala</option>
                  <option value='Elahera'>Elahera</option>
                  <option value='Hingurakgoda'>Hingurakgoda</option>
                  <option value='Lankapura'>Lankapura</option>
                  <option value='Welikanda'>Welikanda</option>
                  <option value='Thamankaduwa'>Thamankaduwa</option>
                  <option value='Medirigiriya'>Medirigiriya</option>
                </optgroup>

                <optgroup label='Monaragala District'>
                  <option value='Monaragala'>Monaragala</option>
                  <option value='Bibile'>Bibile</option>
                  <option value='Buttala'>Buttala</option>
                  <option value='Wellawaya'>Wellawaya</option>
                  <option value='Kataragama'>Kataragama</option>
                  <option value='Siyambalanduwa'>Siyambalanduwa</option>
                  <option value='Medagama'>Medagama</option>
                  <option value='Thanamalvila'>Thanamalvila</option>
                  <option value='Badalkubura'>Badalkubura</option>
                  <option value='Sevangala'>Sevangala</option>
                  <option value='Madulla'>Madulla</option>
                </optgroup>

                <optgroup label='Trinomalee District'>
                  <option value='Trincomalee'>Trincomalee</option>
                  <option value='Gomarankadawala'>Gomarankadawala</option>
                  <option value='Kantalai'>Kantalai</option>
                  <option value='Morawewa'>Morawewa</option>
                  <option value='Padavi Siripura'>Padavi Siripura</option>
                  <option value='Seruvila'>Seruvila</option>
                  <option value='Kuchchaveli'>Kuchchaveli</option>
                  <option value='Muttur'>Muttur</option>
                </optgroup>

                <optgroup label='Mannar District'>
                  <option value='Mannar'>Mannar</option>
                  <option value='Madhu'>Madhu</option>
                  <option value='Manthai West'>Manthai West</option>
                  <option value='Musalai'>Musalai</option>
                  <option value='Nanaddan'>Nanaddan</option>
                </optgroup>

                <optgroup label='Vavuniya District'>
                  <option value='Vavuniya'>Vavuniya</option>
                  <option value='Vavuniya North'>Vavuniya North</option>
                  <option value='Vavuniya South'>Vavuniya South</option>
                  <option value='Venkalacheddikulam'>Venkalacheddikulam</option>
                </optgroup>

                <optgroup label='Kilinochchi District'>
                  <option value='Kilinochchi'>Kilinochchi</option>
                  <option value='Kanagapuram'>Kanagapuram</option>
                  <option value='Pallai'>Pallai</option>
                  <option value='Paranthan'>Paranthan</option>
                  <option value='Poonakary'>Poonakary</option>
                  <option value='Tharamapuram'>Tharamapuram</option>
                  <option value='Thiruvaiyaru'>Thiruvaiyaru</option>
                  <option value='Umayaalpuram'>Umayaalpuram</option>
                </optgroup>

                <optgroup label='Mulative District'>
                  <option value='Mulative'>Mulative</option>
                  <option value='Iranaipalai'>Iranaipalai</option>
                  <option value='Kalvilan'>Kalvilan</option>
                  <option value='Kokkilai'>Kokkilai</option>
                  <option value='Kokkuthoduvai'>Kokkuthoduvai</option>
                  <option value='Maanakulam'>Maanakulam</option>
                  <option value='Mallavi'>Mallavi</option>
                  <option value='Mulliyawalai'>Mulliyawalai</option>
                  <option value='Oddusuddan'>Oddusuddan</option>
                  <option value='Puthukkudiyiruppu'>Puthukkudiyiruppu</option>
                  <option value='Thunukkai'>Thunukkai</option>
                </optgroup>
        </select>
    </div>
  )
}

export default Location
